from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .yolo_detector import detect_bigbags_video

@csrf_exempt
def detect_bigbags_video_view(request):
    if request.method == "POST" and request.FILES.get("file"):
        video_file = request.FILES["file"]

        # Sauvegarde temporaire de la vidéo
        video_path = f"temp_{video_file.name}"
        with open(video_path, "wb+") as destination:
            for chunk in video_file.chunks():
                destination.write(chunk)

        # Détection YOLO sur la vidéo
        count = detect_bigbags_video(video_path)

        return JsonResponse({
            "video": video_file.name,
            "bigbags_detected": count
        })

    return JsonResponse({"error": "No video uploaded"}, status=400)
