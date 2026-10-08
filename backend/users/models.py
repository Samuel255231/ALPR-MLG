from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Administrateur'),
        ('operateur', 'Opérateur'),
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
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='operateur')

    @property
    def est_admin(self):
        return self.is_superuser or self.role == 'admin'
