from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from rest_framework.authtoken.models import Token



class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Administrateur'),
        ('quai', 'Agent de quai'),
        ('securite', 'Sécurité')
    )
    email = models.EmailField(
        blank=True,
        null=True,
        unique=False
    )
    telephone = models.CharField(
        max_length=15,
        null=True,
        blank=True
    )
    role = models.CharField(max_length=15, choices=ROLE_CHOICES)
    