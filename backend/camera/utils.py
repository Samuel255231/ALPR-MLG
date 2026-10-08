import subprocess
import os

def start_hls_stream(camera: "Camera"):
    """
    Convertit le RTSP de la caméra en HLS pour le streaming.
    """
    output_dir = f"media/hls/{camera.id}"
    os.makedirs(output_dir, exist_ok=True)
    m3u8_path = os.path.join(output_dir, "stream.m3u8")

    # Commande ffmpeg
    cmd = [
        "ffmpeg",
        "-i", camera.rtsp_url,
        "-c:v", "copy",
        "-c:a", "aac",
        "-f", "hls",
        "-hls_time", "2",
        "-hls_list_size", "3",
        "-hls_flags", "delete_segments",
        m3u8_path
    ]

    subprocess.Popen(cmd)
    return f"/media/hls/{camera.id}/stream.m3u8"
