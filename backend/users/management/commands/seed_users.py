import os

from django.core.management.base import BaseCommand, CommandError

from users.models import User


class Command(BaseCommand):
    help = "Crée le premier compte administrateur (mot de passe lu dans ADMIN_PASSWORD du .env)"

    def handle(self, *args, **options):
        username = os.getenv('ADMIN_USERNAME', 'admin')
        password = os.getenv('ADMIN_PASSWORD')
        email = os.getenv('ADMIN_EMAIL', '')

        if not password:
            raise CommandError("ADMIN_PASSWORD est absent du .env : ajoutez-le puis relancez la commande.")

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f"Le compte '{username}' existe déjà."))
            return

        User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            role='admin',
        )
        self.stdout.write(self.style.SUCCESS(f"Compte administrateur '{username}' créé."))
