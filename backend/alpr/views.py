#alpr\views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models.functions import TruncDay
from django.db.models import Count
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import models
from .models import Plaque, Camera, Vehicule, Proprietaire
from .yolo_detector import detect_plate, detect_plate_video
from django.http import HttpResponse
import os
import tempfile
from django.core.files.storage import FileSystemStorage

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
            "camera_name": camera.nom,
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
        .values('id', 'nom', 'total_detectees', 'total_reconnues', 'total_alertes')
    )
    # Calculer les taux
    data = []
    for stat in camera_stats:
        total = stat['total_detectees']
        taux_reconnaissance = (stat['total_reconnues'] * 100.0 / total) if total > 0 else 0
        taux_alerte = (stat['total_alertes'] * 100.0 / total) if total > 0 else 0
        
        data.append({
            'camera': stat['nom'],
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


@api_view(['GET'])
@permission_classes([AllowAny])
def get_proprietaire_by_plaque(request):
    plaque = request.GET.get("plaque")
    if not plaque:
        return Response({"error": "Paramètre 'plaque' manquant"}, status=400)

    try:
        vehicule = Vehicule.objects.get(numero_plaque=plaque)
        proprietaire = Proprietaire.objects.get(vehicule=vehicule)
        return Response({
            "plaque": vehicule.numero_plaque,
            "marque": vehicule.marque,
            "modele": vehicule.modele,
            "statut": vehicule.statut,
            "nom": proprietaire.nom,
            "chauffeur": proprietaire.chauffeur
        })
    except Vehicule.DoesNotExist:
        return Response({"error": "Plaque inconnue"}, status=404)
    except Proprietaire.DoesNotExist:
        return Response({"error": "Propriétaire non trouvé"}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
def add_proprietaire(request):
    """
    Endpoint pour ajouter un propriétaire manuellement si la plaque est inconnue.
    """
    plaque = request.data.get("plaque")
    nom = request.data.get("nom")
    marque = request.data.get("marque")
    modele = request.data.get("modele")
    chauffeur = request.data.get("chauffeur")

    if not plaque or not nom or not marque or not modele:
        return Response({"error": "Champs obligatoires manquants"}, status=400)

    # Vérifier si le véhicule existe déjà
    vehicule, created = Vehicule.objects.get_or_create(
        numero_plaque=plaque,
        defaults={"marque": marque, "modele": modele, "statut": "actif"}
    )

    # Créer ou mettre à jour le propriétaire
    proprietaire, created_prop = Proprietaire.objects.get_or_create(
        vehicule=vehicule,
        defaults={"nom": nom, "chauffeur": chauffeur}
    )

    if not created_prop:
        proprietaire.nom = nom
        proprietaire.chauffeur = chauffeur
        proprietaire.save()

    return Response({
        "success": True,
        "message": "Propriétaire ajouté ou mis à jour",
        "plaque": vehicule.numero_plaque,
        "marque": vehicule.marque,
        "modele": vehicule.modele,
        "statut": vehicule.statut,
        "nom": proprietaire.nom,
        "chauffeur": proprietaire.chauffeur
    })

class ProprietairePagination(PageNumberPagination):
    page_size = 10
@api_view(['GET'])
@permission_classes([AllowAny])
def list_proprietaires(request):
    search = request.GET.get("search", "")
    proprietaires = Proprietaire.objects.all()

    if search:
        proprietaires = proprietaires.filter(
            nom__icontains=search
        ) | proprietaires.filter(
            vehicule__numero_plaque__icontains=search
        )

    paginator = ProprietairePagination()
    result_page = paginator.paginate_queryset(proprietaires, request)

    data = [
        {
            "id": p.id,
            "plaque": p.vehicule.numero_plaque,
            "marque": p.vehicule.marque,
            "modele": p.vehicule.modele,
            "statut": p.vehicule.statut,
            "nom": p.nom,
            "chauffeur": p.chauffeur,
        }
        for p in result_page
    ]

    return paginator.get_paginated_response(data)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_proprietaire(request, id):
    try:
        proprietaire = Proprietaire.objects.get(id=id)
        proprietaire.delete()
        return Response({"success": True, "message": "Propriétaire supprimé"})
    except Proprietaire.DoesNotExist:
        return Response({"error": "Propriétaire introuvable"}, status=404)
    
@api_view(['PUT'])
@permission_classes([AllowAny])
def update_proprietaire(request, id):
    """
    Endpoint pour modifier les informations d'un propriétaire et de son véhicule.
    """
    try:
        proprietaire = Proprietaire.objects.get(id=id)
        vehicule = proprietaire.vehicule

        # Récupérer les champs envoyés
        nom = request.data.get("nom", proprietaire.nom)
        chauffeur = request.data.get("chauffeur", proprietaire.chauffeur)
        marque = request.data.get("marque", vehicule.marque)
        modele = request.data.get("modele", vehicule.modele)
        statut = request.data.get("statut", vehicule.statut)

        # Mise à jour
        proprietaire.nom = nom
        proprietaire.chauffeur = chauffeur
        proprietaire.save()

        vehicule.marque = marque
        vehicule.modele = modele
        vehicule.statut = statut
        vehicule.save()

        return Response({
            "success": True,
            "message": "Propriétaire mis à jour",
            "id": proprietaire.id,
            "plaque": vehicule.numero_plaque,
            "marque": vehicule.marque,
            "modele": vehicule.modele,
            "statut": vehicule.statut,
            "nom": proprietaire.nom,
            "chauffeur": proprietaire.chauffeur
        })

    except Proprietaire.DoesNotExist:
        return Response({"error": "Propriétaire introuvable"}, status=404)
