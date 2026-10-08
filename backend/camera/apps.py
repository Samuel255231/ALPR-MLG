from django.apps import AppConfig


class CameraConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'camera'

    # def ready(self):
    #     from .stream_manager import start_streams
    #     start_streams()
