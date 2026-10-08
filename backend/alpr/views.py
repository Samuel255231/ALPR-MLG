#alpr\views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db.models.functions import TruncDay
from django.db.models import Count
from django.db import models
from camera.models import Camera
from .models import Plaque
from .yolo_detector import detect_plate, detect_plate_video
from django.http import HttpResponse
import os
import tempfile

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
    Endpoint pour uploader une image ou une vidéo et détecter les plaques.
    """
    file = request.FILES.get('file')
    camera_id = request.POST.get("camera_id")

    if not file:
        return Response({"error": "Aucun fichier fourni"}, status=400)

    try:
        camera = Camera.objects.get(id=camera_id)
    except Camera.DoesNotExist:
        return Response({"error": "Caméra introuvable"}, status=400)

    try:
        # Sauvegarde temporaire du fichier
        import tempfile
        import os
        
        # Créer un fichier temporaire
        suffix = os.path.splitext(file.name)[1]  # .jpg, .mp4, etc.
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
            for chunk in file.chunks():
                tmp_file.write(chunk)
            temp_path = tmp_file.name

        # Détection selon le type MIME
        if file.content_type.startswith("video"):
            plates, video_url = detect_plate_video(temp_path)
            image_url = None
        else:
            plates, image_url = detect_plate(temp_path)
            video_url = None

        # Sauvegarde dans la base
        for p in plates:
            Plaque.objects.create(
                numero=p["numero"],
                reconnue=True if p["confidence"] > 0.7 else False,
                alerte=True if p["confidence"] < 0.4 else False,
                camera=camera
            )

        response_data = {
            "results": plates,
            "camera_name": camera.code,
        }
        
        if image_url:
            response_data["image_url"] = image_url
        if video_url:
            response_data["video_url"] = video_url

        return Response(response_data)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

    finally:
        # Nettoyage du fichier temporaire
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)

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
