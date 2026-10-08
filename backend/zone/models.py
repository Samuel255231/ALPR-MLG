from django.db import models

class Zone(models.Model):
    nom=models.CharField(max_length=50)
