import cv2
import easyocr
import numpy as np

from .plaque_mg import compacter, corriger_par_position, est_conforme, mettre_en_forme

# Caractères possibles sur une plaque
CARACTERES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

# On arrête dès qu'une lecture au bon format atteint cette confiance
SEUIL_ARRET = 0.8

_reader = None


def get_reader():
    """Charge EasyOCR une seule fois, à la première lecture (le chargement est long)."""
    global _reader
    if _reader is None:
        _reader = easyocr.Reader(['fr'], gpu=False)
    return _reader


def _en_gris(image, hauteur):
    """Niveaux de gris, agrandis pour que la plaque fasse au moins `hauteur` pixels."""
    gris = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if image.ndim == 3 else image
    facteur = max(1.0, hauteur / gris.shape[0])
    return cv2.resize(gris, None, fx=facteur, fy=facteur, interpolation=cv2.INTER_CUBIC)


def _gris(image):
    return _en_gris(image, 100)


def _debruite(image):
    return cv2.bilateralFilter(_en_gris(image, 160), 7, 50, 50)


def _accentue(image):
    gris = _en_gris(image, 160)
    flou = cv2.GaussianBlur(gris, (0, 0), 3)
    return cv2.addWeighted(gris, 1.8, flou, -0.8, 0)


# Prétraitements essayés dans cet ordre (testés sur des plaques réelles)
PRETRAITEMENTS = (_gris, _debruite, _accentue)


def _lire_une_fois(image):
    """Une lecture EasyOCR. Renvoie (texte compact, confiance moyenne)."""
    morceaux = get_reader().readtext(image, detail=1, paragraph=False, allowlist=CARACTERES)
    if not morceaux:
        return '', 0.0

    # plaque sur deux lignes : on lit ligne par ligne, puis de gauche à droite
    hauteur_ligne = image.shape[0] / 3.5

    def position(m):
        y = np.mean([p[1] for p in m[0]])
        x = np.mean([p[0] for p in m[0]])
        return (round(y / hauteur_ligne), x)

    morceaux.sort(key=position)
    texte = ''.join(compacter(m[1]) for m in morceaux)
    confiance = float(np.mean([m[2] for m in morceaux]))
    return corriger_par_position(texte), confiance


def lire_plaque(image_plaque):
    """Lit une plaque recadrée.

    Renvoie un dictionnaire : texte (INCONNU si rien de lisible), confiance (de la lecture)
    et conforme (True si le texte a le format d'une plaque malgache).
    """
    essais = []
    for pretraiter in PRETRAITEMENTS:
        texte, confiance = _lire_une_fois(pretraiter(image_plaque))
        essais.append((texte, confiance))
        if est_conforme(texte) and confiance >= SEUIL_ARRET:
            break

    # on garde la lecture au bon format, puis la plus confiante
    texte, confiance = max(essais, key=lambda e: (est_conforme(e[0]), e[1]))

    if not texte:
        return {'texte': 'INCONNU', 'confiance': 0.0, 'conforme': False}

    return {
        'texte': mettre_en_forme(texte)[:20],
        'confiance': confiance,
        'conforme': est_conforme(texte),
    }
