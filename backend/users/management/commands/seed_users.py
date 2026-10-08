from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = "Seed initial users"

    def handle(self, *args, **kwargs):
        users = [
            {
                "username": "admin",
                "email": "admin@gmail.com",
                "first_name": "RAMANANKASINA",
                "last_name": "Nicolas",
                "password": "admin 123",
                "role": "admin",
                "telephone":"0346686338",
            }
        ]

        for u in users:
            if not User.objects.filter(username=u["username"]).exists():
                user = User.objects.create_user(
                    username=u["username"],
                    email=u["email"],
                    first_name=u["first_name"],
                    last_name=u["last_name"],
                    password=u["password"],
                    telephone=u["telephone"],
                )
                if "role" in u:
                    user.role = u["role"]
                user.save()
                self.stdout.write(self.style.SUCCESS(f"✔ User '{u['username']}' created."))
            else:
                self.stdout.write(self.style.WARNING(f"⚠ User '{u['username']}' already exists."))
