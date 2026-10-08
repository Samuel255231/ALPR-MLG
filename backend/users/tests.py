from rest_framework.test import APITestCase

from .models import User


class ConnexionTest(APITestCase):
    def setUp(self):
        User.objects.create_user(username='oper', password='Oper-Test-12345', role='operateur')

    def test_connexion_renvoie_les_jetons_et_le_role_sans_mot_de_passe(self):
        reponse = self.client.post('/users/login/', {'username': 'oper', 'password': 'Oper-Test-12345'})
        self.assertEqual(reponse.status_code, 200)
        corps = reponse.json()
        self.assertTrue(corps['access'] and corps['refresh'])
        self.assertEqual(corps['user']['role'], 'operateur')
        self.assertNotIn('password', corps['user'])

    def test_mauvais_mot_de_passe(self):
        reponse = self.client.post('/users/login/', {'username': 'oper', 'password': 'faux'})
        self.assertEqual(reponse.status_code, 401)
        self.assertNotIn('access', reponse.json())

    def test_compte_desactive_ne_peut_pas_se_connecter(self):
        User.objects.filter(username='oper').update(is_active=False)
        reponse = self.client.post('/users/login/', {'username': 'oper', 'password': 'Oper-Test-12345'})
        self.assertEqual(reponse.status_code, 401)

    def test_le_jeton_donne_acces_a_l_api(self):
        jeton = self.client.post('/users/login/', {'username': 'oper', 'password': 'Oper-Test-12345'}).json()['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + jeton)
        self.assertEqual(self.client.get('/alpr/auth_test/').status_code, 200)

    def test_jeton_invalide_refuse(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer pas-un-vrai-jeton')
        self.assertEqual(self.client.get('/alpr/totals/').status_code, 401)


class AdministrationDesComptesTest(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username='chef', password='Admin-Test-12345', role='admin')
        self.operateur = User.objects.create_user(username='oper', password='Oper-Test-12345', role='operateur')
        self.nouveau = {'username': 'nouveau', 'password': 'Nouveau-Test-123', 'role': 'operateur'}

    # --- sans connexion ---
    def test_anonyme_ne_peut_rien_administrer(self):
        self.assertEqual(self.client.get('/users/').status_code, 401)
        self.assertEqual(self.client.post('/users/registration/', self.nouveau).status_code, 401)
        self.assertEqual(self.client.post(f'/users/{self.operateur.id}/status_compte/').status_code, 401)
        self.assertEqual(self.client.put('/users/reset_password/', {'user_id': self.operateur.id}).status_code, 401)
        self.assertFalse(User.objects.filter(username='nouveau').exists())

    # --- opérateur ---
    def test_operateur_ne_peut_pas_administrer(self):
        self.client.force_authenticate(self.operateur)
        self.assertEqual(self.client.get('/users/').status_code, 403)
        self.assertEqual(self.client.post('/users/registration/', {**self.nouveau, 'role': 'admin'}).status_code, 403)
        self.assertEqual(self.client.post(f'/users/{self.admin.id}/status_compte/').status_code, 403)
        reset = {'user_id': self.admin.id, 'password': 'Autre-Test-12345', 'password2': 'Autre-Test-12345'}
        self.assertEqual(self.client.put('/users/reset_password/', reset).status_code, 403)
        self.assertFalse(User.objects.filter(username='nouveau').exists())

    # --- administrateur ---
    def test_admin_liste_les_comptes(self):
        self.client.force_authenticate(self.admin)
        reponse = self.client.get('/users/')
        self.assertEqual(reponse.status_code, 200)
        self.assertEqual(len(reponse.json()), 2)

    def test_admin_cree_un_compte(self):
        self.client.force_authenticate(self.admin)
        reponse = self.client.post('/users/registration/', self.nouveau)
        self.assertEqual(reponse.status_code, 201)
        compte = User.objects.get(username='nouveau')
        self.assertEqual(compte.role, 'operateur')
        self.assertTrue(compte.check_password('Nouveau-Test-123'))   # mot de passe bien haché

    def test_ancien_role_refuse(self):
        self.client.force_authenticate(self.admin)
        for role in ('quai', 'securite', 'observateur', 'ADMIN'):
            reponse = self.client.post('/users/registration/', {**self.nouveau, 'role': role})
            self.assertEqual(reponse.status_code, 400, role)
        self.assertFalse(User.objects.filter(username='nouveau').exists())

    def test_sans_role_le_compte_est_operateur(self):
        self.client.force_authenticate(self.admin)
        donnees = {'username': 'sans_role', 'password': 'Nouveau-Test-123'}
        self.assertEqual(self.client.post('/users/registration/', donnees).status_code, 201)
        self.assertEqual(User.objects.get(username='sans_role').role, 'operateur')

    def test_admin_active_et_desactive_un_compte(self):
        self.client.force_authenticate(self.admin)
        url = f'/users/{self.operateur.id}/status_compte/'
        self.assertFalse(self.client.post(url).json()['is_active'])
        self.assertTrue(self.client.post(url).json()['is_active'])

    def test_admin_ne_peut_pas_se_desactiver(self):
        self.client.force_authenticate(self.admin)
        reponse = self.client.post(f'/users/{self.admin.id}/status_compte/')
        self.assertEqual(reponse.status_code, 400)
        self.admin.refresh_from_db()
        self.assertTrue(self.admin.is_active)

    def test_compte_inconnu(self):
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.post('/users/99999/status_compte/').status_code, 404)
        reset = {'user_id': 99999, 'password': 'Autre-Test-12345', 'password2': 'Autre-Test-12345'}
        self.assertEqual(self.client.put('/users/reset_password/', reset).status_code, 404)

    def test_admin_reinitialise_un_mot_de_passe(self):
        self.client.force_authenticate(self.admin)
        reset = {'user_id': self.operateur.id, 'password': 'Autre-Test-12345', 'password2': 'Autre-Test-12345'}
        self.assertEqual(self.client.put('/users/reset_password/', reset).status_code, 200)
        self.operateur.refresh_from_db()
        self.assertTrue(self.operateur.check_password('Autre-Test-12345'))

    def test_reinitialisation_refusee_si_les_mots_de_passe_different(self):
        self.client.force_authenticate(self.admin)
        reset = {'user_id': self.operateur.id, 'password': 'Autre-Test-12345', 'password2': 'Difference-12345'}
        self.assertEqual(self.client.put('/users/reset_password/', reset).status_code, 400)

    # --- changement de son propre mot de passe ---
    def test_chacun_change_son_mot_de_passe(self):
        self.client.force_authenticate(self.operateur)
        donnees = {'old_password': 'Oper-Test-12345', 'password': 'Nouveau-Mdp-12345', 'password2': 'Nouveau-Mdp-12345'}
        reponse = self.client.put('/users/change_password/', donnees)
        self.assertEqual(reponse.status_code, 200)
        self.operateur.refresh_from_db()
        self.assertTrue(self.operateur.check_password('Nouveau-Mdp-12345'))

    def test_changement_refuse_avec_un_mauvais_ancien_mot_de_passe(self):
        self.client.force_authenticate(self.operateur)
        donnees = {'old_password': 'faux', 'password': 'Nouveau-Mdp-12345', 'password2': 'Nouveau-Mdp-12345'}
        self.assertEqual(self.client.put('/users/change_password/', donnees).status_code, 400)


class RoleTest(APITestCase):
    def test_role_par_defaut_et_droits(self):
        simple = User.objects.create_user(username='a', password='x')
        self.assertEqual(simple.role, 'operateur')
        self.assertFalse(simple.est_admin)
        self.assertTrue(User.objects.create_user(username='b', password='x', role='admin').est_admin)
        self.assertTrue(User.objects.create_superuser(username='c', password='x').est_admin)
