import re

# Plaque malgache : 4 chiffres puis 2 ou 3 lettres (ex. 1844 TAH, 0904 FG)
FORMAT = re.compile(r'\d{4}[A-Z]{2,3}')

# Confusions fréquentes de l'OCR, utilisées selon la position du caractère
VERS_CHIFFRE = {'O': '0', 'Q': '0', 'D': '0', 'I': '1', 'L': '1', 'Z': '2',
                'S': '5', 'G': '6', 'B': '8', 'T': '7', 'A': '4'}
VERS_LETTRE = {'0': 'O', '1': 'I', '5': 'S', '8': 'B', '2': 'Z', '6': 'G',
               '7': 'T', '4': 'A'}


def compacter(texte):
    """Majuscules, sans espace ni symbole."""
    return re.sub(r'[^A-Z0-9]', '', (texte or '').upper())


def corriger_par_position(texte):
    """Les 4 premiers caractères doivent être des chiffres, les suivants des lettres."""
    if len(texte) not in (6, 7):
        return texte
    chiffres = ''.join(VERS_CHIFFRE.get(c, c) for c in texte[:4])
    lettres = ''.join(VERS_LETTRE.get(c, c) for c in texte[4:])
    return chiffres + lettres


def est_conforme(texte):
    return FORMAT.fullmatch(texte) is not None


def mettre_en_forme(texte):
    """1844TAH -> 1844 TAH (seulement si le texte a le bon format)."""
    if est_conforme(texte):
        return f"{texte[:4]} {texte[4:]}"
    return texte
