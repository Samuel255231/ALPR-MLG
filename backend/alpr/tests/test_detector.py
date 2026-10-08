from django.test import SimpleTestCase

from alpr.services.detector import (
    _PlaqueSuivie,
    _iou,
    _recouvrement,
    _sans_boites_imbriquees,
)


def lecture(texte, confiance, conforme=True):
    return {'texte': texte, 'confiance': confiance, 'conforme': conforme}


class BoitesTest(SimpleTestCase):
    def test_recouvrement_et_iou(self):
        a = (0, 0, 10, 10)
        self.assertEqual(_recouvrement(a, (5, 5, 15, 15)), 25)
        self.assertEqual(_recouvrement(a, (20, 20, 30, 30)), 0)
        self.assertEqual(_iou(a, a), 1)
        self.assertEqual(_iou(a, (20, 20, 30, 30)), 0)
        # 25 de surface commune, 100 + 100 - 25 au total
        self.assertAlmostEqual(_iou(a, (5, 5, 15, 15)), 25 / 175)

    def test_boite_a_l_interieur_d_une_autre_est_ecartee(self):
        # la plaque entière + un morceau (les chiffres seuls) qui est dedans
        entiere = ((0, 0, 100, 60), 0.4)
        morceau = ((10, 5, 90, 25), 0.38)
        resultat = _sans_boites_imbriquees([morceau, entiere])
        self.assertEqual(resultat, [entiere])

    def test_deux_plaques_separees_sont_gardees(self):
        a = ((0, 0, 50, 30), 0.6)
        b = ((100, 0, 150, 30), 0.5)
        self.assertEqual(len(_sans_boites_imbriquees([a, b])), 2)


class PlaqueSuivieTest(SimpleTestCase):
    def setUp(self):
        self.plaque = _PlaqueSuivie((0, 0, 10, 10), 0.5)

    def test_sans_lecture(self):
        self.assertEqual(self.plaque.meilleure_lecture()['texte'], 'INCONNU')
        self.assertTrue(self.plaque.a_lire_encore())

    def test_le_texte_conforme_le_plus_lu_gagne(self):
        # 1844 TAH lu deux fois avec une confiance moyenne, 7844 TIH lu une fois avec une confiance un peu plus haute
        self.plaque.lectures = [
            lecture('7844 TIH', 0.55),
            lecture('1844 TAH', 0.5),
            lecture('1844 TAH', 0.45),
        ]
        meilleure = self.plaque.meilleure_lecture()
        self.assertEqual(meilleure['texte'], '1844 TAH')
        self.assertEqual(meilleure['confiance'], 0.5)

    def test_un_texte_conforme_passe_avant_un_texte_partiel(self):
        self.plaque.lectures = [lecture('9914', 0.99, conforme=False), lecture('9914 TV', 0.4)]
        self.assertEqual(self.plaque.meilleure_lecture()['texte'], '9914 TV')

    def test_sans_texte_conforme_on_garde_la_lecture_la_plus_confiante(self):
        self.plaque.lectures = [lecture('99', 0.2, False), lecture('9914', 0.9, False), lecture('INCONNU', 0.0, False)]
        self.assertEqual(self.plaque.meilleure_lecture()['texte'], '9914')

    def test_arret_des_lectures_quand_une_lecture_est_sure(self):
        self.plaque.lectures = [lecture('2032 TAB', 0.95)]
        self.assertFalse(self.plaque.a_lire_encore())

    def test_arret_apres_le_nombre_maximal_de_lectures(self):
        self.plaque.lectures = [lecture('X', 0.1, False)] * 4
        self.assertFalse(self.plaque.a_lire_encore())
