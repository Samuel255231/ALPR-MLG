import os
import subprocess
from camera.models import Camera

MEDIA_PATH = "media/hls/"

# Assure-toi que le dossier principal existe
os.makedirs(MEDIA_PATH, exist_ok=True)

for cam in Camera.objects.all():
    cam_path = os.path.join(MEDIA_PATH, cam.code)
    os.makedirs(cam_path, exist_ok=True)  # multiplateforme

    command = [
        "ffmpeg",
        "-rtsp_transport", "tcp",  # utile pour éviter timeout UDP
        "-i", cam.rtsp_url,
        "-c:v", "copy",
        "-c:a", "aac",
        "-f", "hls",
        "-hls_time", "2",
        "-hls_list_size", "5",
        "-hls_flags", "delete_segments",
        os.path.join(cam_path, "stream.m3u8")
    ]

    # Lancer FFmpeg en arrière-plan
    subprocess.Popen(command)
    print(f"Flux HLS lancé pour la caméra {cam.code}")
