from django.db import models
from camion.models import Camion
class MouvementCamion(models.Model):
    type_CHOICES = (
        ('entree', 'entrée'),
        ('sortie', 'sortie')
    )
    camion = models.ForeignKey(
        Camion,
        on_delete=models.CASCADE,
        related_name="mouvements"
    )
    date=models.DateField(auto_now_add=True)
    type = models.CharField(choices=type_CHOICES,default='entree')
