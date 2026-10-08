from django.db import models
from zone.models import Zone

class Camera(models.Model):
    ROLE_CHOICES = (
        ('entree', 'entrée'),
        ('sortie', 'sortie')
    )
    Status_CHOICES = (
        ('Actif', 'Actif'),
        ('En maintenance', 'En maintenance'),
        ('En panne', 'En panne')
    )
    code = models.CharField(max_length=100)
    rtsp_url = models.CharField(max_length=300)
    description = models.TextField(blank=True, null=True)
    type = models.CharField(max_length=15, choices=ROLE_CHOICES)
    zone = models.ForeignKey(
        Zone,
        on_delete=models.CASCADE,
        related_name="cameras"
    )
    status = models.CharField(choices=Status_CHOICES,default='Actif')

    def __str__(self):
        return self.code

