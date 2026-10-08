from django.db import models
from camera.models import Camera

class Mouvement(models.Model):
    quantite = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    camera = models.ForeignKey(
        Camera,
        on_delete=models.CASCADE,
        related_name="mouvements",
        null=True
    )

    def __str__(self):
        camera_info = self.camera if self.camera else "Aucune caméra"
        return f"{camera_info} - {self.quantite} Big Bags à {self.timestamp.strftime('%d/%m/%Y %H:%M')}"
