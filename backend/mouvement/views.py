from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum,F
from django.utils.timezone import now, timedelta
from django.db.models.functions import TruncDate
from django.views.decorators.csrf import csrf_exempt
from gestion_stock.yolo_detector import detect_bigbags_video,detect_bigbags_image
from .models import Mouvement
from stock.models import Stock
from .serializers import MouvementSerializer,ListMouvementSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from camera.models import Camera
from stock.models import Stock


class list_mouvements(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Mouvement.objects.all().order_by("-timestamp")
    serializer_class = ListMouvementSerializer
class MouvementStatsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        data = (
            Mouvement.objects
            .values(date=TruncDate("timestamp"), type=F("camera__type"))
            .annotate(total=Sum("quantite"))
            .order_by("date")
        )
        grouped = {}
        for entry in data:
            date_str = entry["date"].strftime("%Y-%m-%d")
            if date_str not in grouped:
                grouped[date_str] = {"date": date_str, "entree": 0, "sortie": 0}
            grouped[date_str][entry["type"]] = entry["total"]

        return Response(list(grouped.values()))
class MouvementStatsParCameraDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Récupérer la période depuis la query string (ex: ?range=30d)
        range_param = request.query_params.get("range", "90d")
        days_map = {"7d": 7, "30d": 30, "90d": 90}
        days = days_map.get(range_param, 90)
        start_date = now() - timedelta(days=days)

        # Agréger les mouvements par caméra et type
        data = (
            Mouvement.objects
            .filter(timestamp__gte=start_date)
            .values(camera_code=F("camera__code"), camera_type=F("camera__type"))
            .annotate(quantite=Sum("quantite"))
            .order_by("camera_code", "camera_type")
        )

        # Format de sortie : liste d'objets { camera, type, quantite }
        result = [
            {"camera": entry["camera_code"], "type": entry["camera_type"], "quantite": entry["quantite"]}
            for entry in data
        ]

        return Response(result)
class MouvementTotalView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Optionnel : filtrer par période via query param ?range=7d|30d|90d
        range_param = request.query_params.get("range", None)
        queryset = Mouvement.objects.all()
        stock = Stock.objects.first()  # une seule ligne
        stock_actuel = stock.quantite_actuelle if stock else 0

        if range_param:
            days_map = {"7d": 7, "30d": 30, "90d": 90}
            days = days_map.get(range_param, 90)
            start_date = now() - timedelta(days=days)
            queryset = queryset.filter(timestamp__gte=start_date)

        # Calcul total par type (entrée/sortie)
        totals = (
            queryset
            .values(type=F("camera__type"))  # ou juste "entrée"/"sortie" si tu as un champ type
            .annotate(total_quantite=Sum("quantite"))
        )

        # Format de sortie : { "entree": 1234, "sortie": 567 }
        result = {"stock_actuel": stock_actuel,"entree": 0, "sortie": 0}
        for entry in totals:
            if entry["type"] == "entree":
                result["entree"] = entry["total_quantite"]
            elif entry["type"] == "sortie":
                result["sortie"] = entry["total_quantite"]

        return Response(result)

@csrf_exempt
def detect_bigbags_view(request):
    if request.method == "POST" and request.FILES.get("file"):
        upload_file = request.FILES["file"]
        camera_id = request.POST.get("camera")  
        file_path = f"temp_{upload_file.name}"
        with open(file_path, "wb+") as destination:
            for chunk in upload_file.chunks():
                destination.write(chunk)
        if upload_file.name.lower().endswith((".mp4", ".avi", ".mov")):
            count = detect_bigbags_video(file_path)
        else:
            count = detect_bigbags_image(file_path)
        mouvement = None
        stock = None
        if count > 0 and camera_id:
            camera = Camera.objects.filter(id=camera_id).first()
            if not camera:
                return JsonResponse({"error": "Camera not found"}, status=404)
            mouvement = Mouvement.objects.create(
                quantite=count,
                camera=camera
            )
            stock, created = Stock.objects.get_or_create(
                id=1,
                defaults={"quantite_actuelle": 0}
            )
            if camera.type == "entree":
                stock.quantite_actuelle += count
            elif camera.type == "sortie":
                stock.quantite_actuelle -= count

            stock.save()

        return JsonResponse({
            "file": upload_file.name,
            "bigbags_detected": count,
            "saved_mouvement": mouvement.id if mouvement else None,
            "camera_type": mouvement.camera.type if mouvement else None,
            "current_stock": stock.quantite_actuelle if stock else None
        })

    return JsonResponse({"error": "No file uploaded"}, status=400)

