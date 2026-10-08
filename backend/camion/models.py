from django.db import models

class Camion(models.Model):
    immatriculation = models.CharField(max_length=15)
    marque=models.CharField(max_length=100)
    modele=models.CharField(max_length=100)
    chauffeur=models.CharField(max_length=200)
    etat=models.CharField(max_length=30)
