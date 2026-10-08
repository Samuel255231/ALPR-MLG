import re

import easyocr

_reader = None


def get_reader():
    """Charge EasyOCR une seule fois, à la première lecture (le chargement est long)."""
    global _reader
    if _reader is None:
        _reader = easyocr.Reader(['fr'], gpu=False)
    return _reader


def nettoyer_texte(morceaux):
    """Assemble les morceaux de texte lus et ne garde que lettres, chiffres et espaces."""
    texte = ' '.join(morceaux).upper()
    texte = re.sub(r'[^A-Z0-9 ]', '', texte)
    texte = re.sub(r'\s+', ' ', texte).strip()
    # la colonne numero fait 20 caractères au maximum
    return texte[:20]


def lire_plaque(image_plaque):
    """Lit le texte d'une plaque recadrée. Renvoie INCONNU si rien n'est lisible."""
    morceaux = get_reader().readtext(image_plaque, detail=0)
    return nettoyer_texte(morceaux) or 'INCONNU'
