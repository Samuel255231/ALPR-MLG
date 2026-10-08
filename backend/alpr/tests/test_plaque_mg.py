from django.test import SimpleTestCase

from alpr.services.plaque_mg import (
    compacter,
    corriger_par_position,
    est_conforme,
    mettre_en_forme,
)


class FormatPlaqueTest(SimpleTestCase):
    def test_formats_valides(self):
        # 4 chiffres + 2 ou 3 lettres
        for texte in ('1844TAH', '0904FG', '9914TV', '2032TAB'):
            self.assertTrue(est_conforme(texte), texte)

    def test_formats_invalides(self):
        for texte in ('', 'INCONNU', '9914', 'AE', '123TAB', '12345TAB', '1844TAHX', '1844 TAH'):
            self.assertFalse(est_conforme(texte), texte)

    def test_compacter(self):
        self.assertEqual(compacter(' 1844 tah '), '1844TAH')
        self.assertEqual(compacter("18-44.TA'H"), '1844TAH')
        self.assertEqual(compacter(None), '')

    def test_mise_en_forme(self):
        self.assertEqual(mettre_en_forme('1844TAH'), '1844 TAH')
        self.assertEqual(mettre_en_forme('0904FG'), '0904 FG')
        # un texte qui n'a pas le bon format reste tel quel
        self.assertEqual(mettre_en_forme('9914'), '9914')


class CorrectionParPositionTest(SimpleTestCase):
    def test_lettres_lues_a_la_place_de_chiffres(self):
        # O -> 0, I -> 1, S -> 5, B -> 8 dans les 4 premiers caractères
        self.assertEqual(corriger_par_position('O9O4FG'), '0904FG')
        self.assertEqual(corriger_par_position('I844TAH'), '1844TAH')
        self.assertEqual(corriger_par_position('5964FE'), '5964FE')

    def test_chiffres_lus_a_la_place_de_lettres(self):
        # 7 -> T, 4 -> A, 0 -> O dans les caractères suivants
        self.assertEqual(corriger_par_position('05327S'), '0532TS')
        self.assertEqual(corriger_par_position('18447AH'), '1844TAH')

    def test_longueur_inattendue_non_modifiee(self):
        self.assertEqual(corriger_par_position('9914'), '9914')
        self.assertEqual(corriger_par_position('12345678'), '12345678')

    def test_resultat_conforme_apres_correction(self):
        self.assertTrue(est_conforme(corriger_par_position('05327S')))
