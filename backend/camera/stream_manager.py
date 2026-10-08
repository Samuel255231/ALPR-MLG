import subprocess
import os
from .models import Camera

MEDIA_PATH = "media/cameras"

def start_streams():
    os.makedirs(MEDIA_PATH, exist_ok=True)
    cameras = Camera.objects.all()
    processes = {}

    for cam in cameras:
        output_dir = f"{MEDIA_PATH}/{cam.code}"
        os.makedirs(output_dir, exist_ok=True)
        output_file = f"{output_dir}/stream.m3u8"
        cmd = [
            "ffmpeg",
            "-rtsp_transport", "tcp",  
            "-i", cam.rtsp_url,                   
            "-c:v", "libx264",                    
            "-preset", "veryfast",               
            "-an",                               
            "-f", "hls",                           
            "-hls_time", "2",                      
            "-hls_list_size", "20",                 
            "-hls_flags", "delete_segments+append_list+round_durations",
            "-hls_allow_cache", "0",               
            output_file
        ]
        processes[cam.code] = subprocess.Popen(cmd)

    return processes
