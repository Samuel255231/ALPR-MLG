#\alpr\models.py
from django.db import models
class Camera(models.Model):
    nom = models.CharField(max_length=100)
    def __str__(self):
        return self.nom
class Plaque(models.Model):
    numero = models.CharField(max_length=20, unique=True)
    date_detection = models.DateTimeField(auto_now_add=True)
    reconnue = models.BooleanField(default=False)
    alerte = models.BooleanField(default=False)
    camera = models.ForeignKey(Camera, on_delete=models.CASCADE, null=True)
    def __str__(self):
        return self.numero
class Vehicule(models.Model):
    numero_plaque = models.CharField(max_length=20, unique=True)
    marque = models.CharField(max_length=50)
    modele = models.CharField(max_length=50)
    statut = models.CharField(max_length=20, choices=[("actif", "Actif"), ("inactif", "Inactif")])
    def __str__(self):
        return self.numero_plaque
class Proprietaire(models.Model):
    nom = models.CharField(max_length=100)
    vehicule = models.OneToOneField(Vehicule, on_delete=models.CASCADE)
    chauffeur = models.CharField(max_length=100, null=True, blank=True)
    def __str__(self):
        return self.nom

