import uuid
from pathlib import Path

import cv2
from django.conf import settings
from ultralytics import YOLO

from .ocr import lire_plaque

# Dans une vidéo, on analyse une image sur PAS_ANALYSE (la lecture OCR est lente)
PAS_ANALYSE = 3

VERT = (0, 255, 0)

_model = None


def get_model():
    """Charge le modèle YOLO une seule fois, à la première détection."""
    global _model
    if _model is None:
        chemin = Path(settings.MODEL_PATH)
        if not chemin.exists():
            raise FileNotFoundError(f"Modèle YOLO introuvable : {chemin}")
        _model = YOLO(str(chemin))
    return _model


def _dossier_sortie():
    dossier = Path(settings.MEDIA_ROOT) / 'annotated'
    dossier.mkdir(parents=True, exist_ok=True)
    return dossier


def _url_media(fichier):
    return f"{settings.MEDIA_URL}annotated/{fichier}"


def _analyser(image):
    """Cherche les plaques dans une image et lit leur texte.

    Renvoie une liste de dictionnaires : numero, confidence et box (x1, y1, x2, y2).
    """
    hauteur, largeur = image.shape[:2]
    trouvees = []

    for resultat in get_model().predict(image, verbose=False):
        for boite in resultat.boxes:
            x1, y1, x2, y2 = [int(v) for v in boite.xyxy[0].tolist()]
            # on reste dans l'image
            x1, y1 = max(x1, 0), max(y1, 0)
            x2, y2 = min(x2, largeur), min(y2, hauteur)

            recadrage = image[y1:y2, x1:x2]
            if recadrage.size == 0:
                continue

            trouvees.append({
                'numero': lire_plaque(recadrage),
                'confidence': float(boite.conf[0]),
                'box': (x1, y1, x2, y2),
            })

    return trouvees


def _dessiner(image, plaques):
    for p in plaques:
        x1, y1, x2, y2 = p['box']
        cv2.rectangle(image, (x1, y1), (x2, y2), VERT, 2)
        cv2.putText(image, p['numero'], (x1, max(y1 - 10, 20)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, VERT, 2)


def _sans_box(plaques):
    return [{'numero': p['numero'], 'confidence': p['confidence']} for p in plaques]


def detect_plate(image_path):
    """Détecte les plaques d'une image. Renvoie (plaques, url de l'image annotée)."""
    image = cv2.imread(str(image_path))
    if image is None:
        raise ValueError("Image illisible")

    plaques = _analyser(image)
    _dessiner(image, plaques)

    nom = f"{uuid.uuid4().hex}.jpg"
    cv2.imwrite(str(_dossier_sortie() / nom), image)

    return _sans_box(plaques), _url_media(nom)


def _ouvrir_ecriture_video(chemin, fps, taille):
    # H.264 est lu par les navigateurs ; mp4v sert de secours si H.264 n'est pas disponible
    for codec in ('avc1', 'mp4v'):
        sortie = cv2.VideoWriter(str(chemin), cv2.VideoWriter_fourcc(*codec), fps, taille)
        if sortie.isOpened():
            return sortie
        sortie.release()
    raise RuntimeError("Impossible de créer la vidéo annotée")


def detect_plate_video(video_path):
    """Détecte les plaques d'une vidéo. Renvoie (plaques, url de la vidéo annotée).

    Chaque plaque n'apparaît qu'une fois dans la liste, avec sa meilleure confiance.
    """
    lecture = cv2.VideoCapture(str(video_path))
    if not lecture.isOpened():
        raise ValueError("Vidéo illisible")

    largeur = int(lecture.get(cv2.CAP_PROP_FRAME_WIDTH))
    hauteur = int(lecture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = lecture.get(cv2.CAP_PROP_FPS) or 25

    nom = f"{uuid.uuid4().hex}.mp4"
    sortie = _ouvrir_ecriture_video(_dossier_sortie() / nom, fps, (largeur, hauteur))

    meilleures = {}   # numero -> meilleure confiance vue
    en_cours = []     # plaques de la dernière image analysée, redessinées entre deux analyses
    numero_image = 0

    try:
        while True:
            ok, image = lecture.read()
            if not ok:
                break

            if numero_image % PAS_ANALYSE == 0:
                en_cours = _analyser(image)
                for p in en_cours:
                    if p['confidence'] > meilleures.get(p['numero'], 0):
                        meilleures[p['numero']] = p['confidence']

            _dessiner(image, en_cours)
            sortie.write(image)
            numero_image += 1
    finally:
        lecture.release()
        sortie.release()

    plaques = [{'numero': n, 'confidence': c} for n, c in meilleures.items()]
    return plaques, _url_media(nom)
