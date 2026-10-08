from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase

from alpr.models import Plaque
from alpr.views import statut_plaque
from camera.models import Camera
from users.models import User
from zone.models import Zone


def plaque(numero, lecture, conforme=True, yolo=0.6):
    return {'numero': numero, 'confidence': yolo, 'confiance_lecture': lecture, 'conforme': conforme}


class StatutPlaqueTest(APITestCase):
    def test_reconnue(self):
        self.assertEqual(statut_plaque(plaque('1844 TAH', 0.9)), 'reconnue')

    def test_seuil_de_confiance_de_lecture(self):
        self.assertEqual(statut_plaque(plaque('1844 TAH', 0.7)), 'reconnue')
        self.assertEqual(statut_plaque(plaque('1844 TAH', 0.69)), 'a_verifier')

    def test_texte_non_conforme_a_verifier_meme_si_confiant(self):
        self.assertEqual(statut_plaque(plaque('9914', 0.99, conforme=False)), 'a_verifier')

    def test_illisible(self):
        self.assertEqual(statut_plaque(plaque('INCONNU', 0.0, conforme=False)), 'illisible')

    def test_la_confiance_yolo_ne_change_pas_le_statut(self):
        self.assertEqual(statut_plaque(plaque('1844 TAH', 0.9, yolo=0.1)), 'reconnue')


class ApiAlprTest(APITestCase):
    def setUp(self):
        self.operateur = User.objects.create_user(username='oper', password='Oper-Test-12345', role='operateur')
        zone = Zone.objects.create(nom='Zone test')
        self.camera = Camera.objects.create(code='CAM-1', rtsp_url='-', type='entree', zone=zone)

    def envoyer(self, nom='photo.jpg', type_mime='image/jpeg', **donnees):
        fichier = SimpleUploadedFile(nom, b'contenu', content_type=type_mime)
        donnees.setdefault('camera_id', self.camera.id)
        return self.client.post('/alpr/detect/', {'file': fichier, **donnees})

    # --- accès ---
    def test_tout_exige_une_connexion(self):
        for url in ('/alpr/totals/', '/alpr/detections/', '/alpr/chart_data/', '/alpr/dashboard/top-plates/',
                    '/alpr/dashboard/camera-stats/', '/alpr/dashboard/recognition-stats/'):
            self.assertEqual(self.client.get(url).status_code, 401, url)
        self.assertEqual(self.client.post('/alpr/detect/').status_code, 401)

    # --- détection ---
    @patch('alpr.views.detect_plate')
    def test_detection_d_une_image_enregistre_une_ligne_par_plaque(self, faux_detecteur):
        faux_detecteur.return_value = (
            [plaque('1844 TAH', 0.9), plaque('INCONNU', 0.0, conforme=False), plaque('9914', 0.8, conforme=False)],
            '/media/annotated/essai.jpg',
        )
        self.client.force_authenticate(self.operateur)

        reponse = self.envoyer()

        self.assertEqual(reponse.status_code, 200)
        corps = reponse.json()
        self.assertEqual(corps['image_url'], '/media/annotated/essai.jpg')
        self.assertNotIn('video_url', corps)
        self.assertEqual(corps['camera_name'], 'CAM-1')
        self.assertEqual([p['statut'] for p in corps['results']], ['reconnue', 'illisible', 'a_verifier'])

        lignes = {p.numero: p for p in Plaque.objects.all()}
        self.assertEqual(len(lignes), 3)
        self.assertTrue(lignes['1844 TAH'].reconnue and not lignes['1844 TAH'].alerte)
        self.assertTrue(lignes['INCONNU'].alerte and not lignes['INCONNU'].reconnue)
        self.assertFalse(lignes['9914'].reconnue or lignes['9914'].alerte)
        self.assertEqual(lignes['1844 TAH'].camera, self.camera)

    @patch('alpr.views.detect_plate')
    def test_la_meme_plaque_peut_etre_detectee_plusieurs_fois(self, faux_detecteur):
        faux_detecteur.return_value = ([plaque('1844 TAH', 0.9)], '/media/annotated/a.jpg')
        self.client.force_authenticate(self.operateur)
        self.envoyer()
        self.envoyer()
        self.assertEqual(Plaque.objects.filter(numero='1844 TAH').count(), 2)

    @patch('alpr.views.detect_plate_video')
    @patch('alpr.views.detect_plate')
    def test_une_video_est_reconnue_par_son_type_ou_son_extension(self, faux_image, faux_video):
        faux_video.return_value = ([plaque('2032 TAB', 0.95)], '/media/annotated/essai.mp4')
        self.client.force_authenticate(self.operateur)

        par_type = self.envoyer('clip.bin', 'video/mp4')
        par_extension = self.envoyer('clip.mp4', 'application/octet-stream')

        for reponse in (par_type, par_extension):
            self.assertEqual(reponse.status_code, 200)
            self.assertEqual(reponse.json()['video_url'], '/media/annotated/essai.mp4')
        faux_image.assert_not_called()

    def test_erreurs_d_entree(self):
        self.client.force_authenticate(self.operateur)

        sans_fichier = self.client.post('/alpr/detect/', {'camera_id': self.camera.id})
        self.assertEqual(sans_fichier.status_code, 400)
        self.assertEqual(sans_fichier.json()['error'], 'Aucun fichier fourni')

        self.assertEqual(self.envoyer(camera_id=99999).status_code, 400)
        self.assertEqual(self.envoyer(camera_id='abc').status_code, 400)

    @patch('alpr.views.detect_plate', side_effect=FileNotFoundError('Modèle YOLO introuvable'))
    def test_modele_introuvable_renvoie_503(self, _):
        self.client.force_authenticate(self.operateur)
        reponse = self.envoyer()
        self.assertEqual(reponse.status_code, 503)
        self.assertIn('introuvable', reponse.json()['error'])

    @patch('alpr.views.detect_plate', side_effect=ValueError('Image illisible'))
    def test_fichier_illisible_renvoie_400(self, _):
        self.client.force_authenticate(self.operateur)
        self.assertEqual(self.envoyer().status_code, 400)

    # --- historique et statistiques ---
    def test_historique_et_statistiques(self):
        Plaque.objects.create(numero='1844 TAH', reconnue=True, camera=self.camera)
        Plaque.objects.create(numero='1844 TAH', reconnue=True, camera=self.camera)
        Plaque.objects.create(numero='9914', camera=self.camera)
        Plaque.objects.create(numero='INCONNU', alerte=True, camera=self.camera)
        self.client.force_authenticate(self.operateur)

        historique = self.client.get('/alpr/detections/').json()
        self.assertEqual(len(historique), 4)
        self.assertEqual(historique[0]['camera'], 'CAM-1')   # le code de la caméra
        self.assertEqual(self.client.get('/alpr/totals/').json(),
                         {'detectees': 4, 'reconnues': 2, 'uniques': 3, 'non_reconnues': 2})

        top = self.client.get('/alpr/dashboard/top-plates/').json()
        self.assertEqual(top[0]['plaque'], '1844 TAH')
        self.assertEqual(top[0]['detections'], 2)

        par_camera = self.client.get('/alpr/dashboard/camera-stats/').json()
        self.assertEqual(par_camera[0]['camera'], 'CAM-1')
        self.assertEqual(par_camera[0]['detectees'], 4)
        self.assertEqual(par_camera[0]['taux_reconnaissance'], 50.0)

        reco = self.client.get('/alpr/dashboard/recognition-stats/').json()
        self.assertEqual((reco['total'], reco['reconnues'], reco['alertes']), (4, 2, 1))

    def test_supprimer_une_camera_garde_l_historique(self):
        Plaque.objects.create(numero='1844 TAH', reconnue=True, camera=self.camera)
        self.camera.delete()
        self.assertEqual(Plaque.objects.count(), 1)
        self.assertIsNone(Plaque.objects.get().camera)
