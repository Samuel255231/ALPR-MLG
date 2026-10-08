import os
import tempfile

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db.models.functions import TruncDay
from django.db.models import Count
from django.db import models
from django.http import HttpResponse

from camera.models import Camera
from .models import Plaque
from .services.detector import detect_plate, detect_plate_video


def home(request):
    return HttpResponse("Bienvenue sur l'API ALPR_MLG")
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def auth_test(request):
    user = request.user
    return Response({
        "authenticated": True,
        "username": user.username,
        "email": user.email,
        "role": getattr(user, "role", "inconnu")  # si tu as un champ rôle
    })
# --- Totals pour les cartes du dashboard ---
@api_view(['GET'])
@permission_classes([AllowAny])
def get_totals(request):
    total_detectees = Plaque.objects.count()
    total_reconnues = Plaque.objects.filter(reconnue=True).count()
    total_uniques = Plaque.objects.values('numero').distinct().count()
    total_non_reconnues = Plaque.objects.filter(alerte=True).count()

    return Response({
        "detectees": total_detectees,
        "reconnues": total_reconnues,
        "uniques": total_uniques,
        "non_reconnues": total_non_reconnues
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def detect_and_save(request):
    """
    Reçoit une image ou une vidéo, détecte les plaques et enregistre chaque détection.
    """
    fichier = request.FILES.get('file')
    camera_id = request.POST.get("camera_id")

    if not fichier:
        return Response({"error": "Aucun fichier fourni"}, status=400)

    try:
        camera = Camera.objects.get(id=camera_id)
    except (Camera.DoesNotExist, ValueError, TypeError):
        return Response({"error": "Caméra introuvable"}, status=400)

    chemin_temp = None
    try:
        # Le détecteur travaille sur un vrai fichier : on écrit l'upload dans un fichier temporaire
        extension = os.path.splitext(fichier.name)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as temp:
            for morceau in fichier.chunks():
                temp.write(morceau)
            chemin_temp = temp.name

        reponse = {"camera_name": camera.code}

        if fichier.content_type.startswith("video"):
            plaques, reponse["video_url"] = detect_plate_video(chemin_temp)
        else:
            plaques, reponse["image_url"] = detect_plate(chemin_temp)

        # Une ligne par détection
        Plaque.objects.bulk_create([
            Plaque(
                numero=p["numero"],
                reconnue=p["confidence"] > 0.7,
                alerte=p["confidence"] < 0.4,
                camera=camera,
            )
            for p in plaques
        ])

        reponse["results"] = plaques
        return Response(reponse)

    except FileNotFoundError as erreur:
        # en pratique : le fichier du modèle YOLO est introuvable
        return Response({"error": str(erreur)}, status=503)
    except ValueError as erreur:
        return Response({"error": str(erreur)}, status=400)
    except Exception as erreur:
        return Response({"error": str(erreur)}, status=500)
    finally:
        if chemin_temp and os.path.exists(chemin_temp):
            os.remove(chemin_temp)

# Historique des détections, les plus récentes d'abord
@api_view(['GET'])
@permission_classes([AllowAny])
def list_detections(request):
    plaques = Plaque.objects.select_related('camera').order_by('-date_detection')

    data = [
        {
            'id': p.id,
            'numero': p.numero,
            'date_detection': p.date_detection,
            'reconnue': p.reconnue,
            'alerte': p.alerte,
            'camera': p.camera.code if p.camera else None,
        }
        for p in plaques
    ]
    return Response(data)


# Données pour le graphique interactif
@api_view(['GET'])
@permission_classes([AllowAny])
def get_chart_data(request):
    # Regrouper par jour
    data = (
        Plaque.objects
        .annotate(day=TruncDay('date_detection'))
        .values('day')
        .annotate(
            total_detectees=Count('id'),
            total_reconnues=Count('id', filter=models.Q(reconnue=True)),
            total_alertes=Count('id', filter=models.Q(alerte=True))
        )
        .order_by('day')
    )

    # Structurer pour le frontend
    result = []
    for item in data:
        result.append({
            'date': item['day'].strftime('%Y-%m-%d'),
            'detectees': item['total_detectees'],
            'reconnues': item['total_reconnues'],
            'alertes': item['total_alertes']
        })

    return Response(result)
#Endpoint pour Statistiques caméra (Option 1 : Caméra ↔ Plaques) 
@api_view(['GET'])
@permission_classes([AllowAny])
def get_camera_stats(request):
    # Statistiques par caméra
    camera_stats = (
        Camera.objects
        .annotate(
            total_detectees=Count('plaque'),
            total_reconnues=Count('plaque', filter=models.Q(plaque__reconnue=True)),
            total_alertes=Count('plaque', filter=models.Q(plaque__alerte=True))
        )
        .values('id', 'code', 'total_detectees', 'total_reconnues', 'total_alertes')
    )
    # Calculer les taux
    data = []
    for stat in camera_stats:
        total = stat['total_detectees']
        taux_reconnaissance = (stat['total_reconnues'] * 100.0 / total) if total > 0 else 0
        taux_alerte = (stat['total_alertes'] * 100.0 / total) if total > 0 else 0
        
        data.append({
            'camera': stat['code'],
            'detectees': stat['total_detectees'],
            'reconnues': stat['total_reconnues'],
            'alertes': stat['total_alertes'],
            'taux_reconnaissance': round(taux_reconnaissance, 1),
            'taux_alerte': round(taux_alerte, 1)
        })

    return Response(data)

#Endpoint pour Ratio Reconnues/Non reconnues 
@api_view(['GET'])
@permission_classes([AllowAny])
def get_recognition_stats(request):
    total = Plaque.objects.count()
    reconnues = Plaque.objects.filter(reconnue=True).count()
    non_reconnues = Plaque.objects.filter(reconnue=False).count()
    alertes = Plaque.objects.filter(alerte=True).count()

    return Response({
        'total': total,
        'reconnues': reconnues,
        'non_reconnues': non_reconnues,
        'alertes': alertes,
        'pourcentage_reconnues': round((reconnues * 100.0 / total) if total > 0 else 0, 1),
        'pourcentage_non_reconnues': round((non_reconnues * 100.0 / total) if total > 0 else 0, 1),
        'pourcentage_alertes': round((alertes * 100.0 / total) if total > 0 else 0, 1)
    })


#Endpoint pour Top 10 plaques
@api_view(['GET'])
@permission_classes([AllowAny])
def get_top_plates(request):
    # Top 10 plaques les plus détectées
    top_plates = (
        Plaque.objects
        .values('numero')
        .annotate(
            count=Count('id'),
            reconnues=Count('id', filter=models.Q(reconnue=True)),
            taux_reconnaissance=models.ExpressionWrapper(
                models.F('reconnues') * 100.0 / models.F('count'),
                output_field=models.FloatField()
            )
        )
        .order_by('-count')[:10]
    )

    data = [
        {
            'plaque': item['numero'],
            'detections': item['count'],
            'reconnues': item['reconnues'],
            'taux_reconnaissance': round(item['taux_reconnaissance'], 1) if item['count'] > 0 else 0
        }
        for item in top_plates
    ]

    return Response(data)
