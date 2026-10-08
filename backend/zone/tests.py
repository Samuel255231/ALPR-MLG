from rest_framework.test import APITestCase

from users.models import User
from .models import Zone


class ZoneApiTest(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username='chef', password='x', role='admin')
        self.operateur = User.objects.create_user(username='oper', password='x', role='operateur')
        self.zone = Zone.objects.create(nom='Entrée')

    def test_anonyme_refuse(self):
        self.assertEqual(self.client.get('/zones/').status_code, 401)

    def test_operateur_consulte_mais_ne_modifie_pas(self):
        self.client.force_authenticate(self.operateur)
        self.assertEqual(self.client.get('/zones/').status_code, 200)
        self.assertEqual(self.client.get(f'/zones/{self.zone.id}/').status_code, 200)
        self.assertEqual(self.client.post('/zones/', {'nom': 'Sortie'}).status_code, 403)
        self.assertEqual(self.client.put(f'/zones/{self.zone.id}/', {'nom': 'X'}).status_code, 403)
        self.assertEqual(self.client.delete(f'/zones/{self.zone.id}/').status_code, 403)
        self.assertEqual(Zone.objects.get().nom, 'Entrée')

    def test_admin_gere_les_zones(self):
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.post('/zones/', {'nom': 'Sortie'}).status_code, 201)
        self.assertEqual(self.client.put(f'/zones/{self.zone.id}/', {'nom': 'Parking'}).status_code, 200)
        self.assertEqual(Zone.objects.get(id=self.zone.id).nom, 'Parking')
        self.assertEqual(self.client.delete(f'/zones/{self.zone.id}/').status_code, 204)
