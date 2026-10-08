from django.db import models


class Plaque(models.Model):
    numero = models.CharField(max_length=20, unique=True)
    date_detection = models.DateTimeField(auto_now_add=True)
    reconnue = models.BooleanField(default=False)
    alerte = models.BooleanField(default=False)
    # Si la caméra est supprimée, on garde quand même l'historique des détections
    camera = models.ForeignKey(
        'camera.Camera',
        on_delete=models.SET_NULL,
        null=True,
    )

    def __str__(self):
        return self.numero
