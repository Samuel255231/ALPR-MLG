from rest_framework.test import APITestCase

from users.models import User
from zone.models import Zone
from .models import Camera


class CameraApiTest(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username='chef', password='x', role='admin')
        self.operateur = User.objects.create_user(username='oper', password='x', role='operateur')
        self.zone = Zone.objects.create(nom='Entrée')
        self.camera = Camera.objects.create(code='CAM-1', rtsp_url='-', type='entree', zone=self.zone)
        self.nouvelle = {'code': 'CAM-2', 'rtsp_url': '-', 'type': 'sortie', 'zone': self.zone.id, 'status': 'Actif'}

    def test_anonyme_refuse(self):
        self.assertEqual(self.client.get('/cameras/').status_code, 401)

    def test_operateur_consulte_mais_ne_modifie_pas(self):
        self.client.force_authenticate(self.operateur)
        liste = self.client.get('/cameras/')
        self.assertEqual(liste.status_code, 200)
        self.assertEqual(liste.json()[0]['zone']['nom'], 'Entrée')   # la zone est détaillée dans la liste
        self.assertEqual(self.client.post('/cameras/', self.nouvelle).status_code, 403)
        self.assertEqual(self.client.put(f'/cameras/{self.camera.id}/', self.nouvelle).status_code, 403)
        self.assertEqual(self.client.delete(f'/cameras/{self.camera.id}/').status_code, 403)
        self.assertEqual(Camera.objects.count(), 1)

    def test_admin_gere_les_cameras(self):
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.post('/cameras/', self.nouvelle).status_code, 201)
        modif = self.client.put(f'/cameras/{self.camera.id}/', {**self.nouvelle, 'code': 'CAM-9'})
        self.assertEqual(modif.status_code, 200)
        self.assertEqual(Camera.objects.get(id=self.camera.id).code, 'CAM-9')
        self.assertEqual(self.client.delete(f'/cameras/{self.camera.id}/').status_code, 204)
