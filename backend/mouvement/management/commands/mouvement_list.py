import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.utils.timezone import make_aware
from camera.models import Camera
from mouvement.models import Mouvement

class Command(BaseCommand):
    help = "Génère des mouvements fictifs sur 3 mois complets : août, septembre et octobre"

    def handle(self, *args, **options):
        # Récupération des caméras
        try:
            camera_entree = Camera.objects.get(id=1)
            camera_sortie = Camera.objects.get(id=2)
        except Camera.DoesNotExist:
            self.stdout.write(self.style.ERROR("Les caméras avec id=1 et id=2 doivent exister."))
            return

        today = datetime.today()

        # Début du mois d'août
        start_date = make_aware(datetime(today.year, 8, 1))
        # Fin du mois d'octobre (aujourd'hui)
        end_date = make_aware(datetime(today.year, today.month, today.day))

        total_days = (end_date - start_date).days + 1

        for i in range(total_days):
            date = start_date + timedelta(days=i)

            # Entrée : valeur aléatoire
            entree_qty = random.randint(50, 200)
            # Sortie : jamais plus que entrée
            sortie_qty = random.randint(0, entree_qty)

            # Création mouvements
            Mouvement.objects.create(quantite=entree_qty, timestamp=date, camera=camera_entree)
            Mouvement.objects.create(quantite=sortie_qty, timestamp=date, camera=camera_sortie)

        self.stdout.write(self.style.SUCCESS(
            f"Données fictives générées pour août, septembre et octobre du {start_date.date()} au {end_date.date()} !"
        ))
