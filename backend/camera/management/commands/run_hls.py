from django.core.management.base import BaseCommand
from camera.stream_manager import start_streams

class Command(BaseCommand):
    help = "Démarre les streams HLS pour toutes les caméras"

    def handle(self, *args, **kwargs):
        processes = start_streams()
        self.stdout.write(self.style.SUCCESS(f"Streams démarrés: {len(processes)} caméras"))
        try:
            while True:
                pass
        except KeyboardInterrupt:
            # Terminer les processus FFmpeg proprement
            for code, proc in processes.items():
                proc.terminate()
            self.stdout.write(self.style.WARNING("Streams arrêtés"))
