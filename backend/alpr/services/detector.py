import uuid
from pathlib import Path

import cv2
from django.conf import settings
from ultralytics import YOLO

from .ocr import lire_plaque

# Vidéo : nombre d'images analysées par seconde (les autres images sont seulement recopiées)
ANALYSES_PAR_SECONDE = 4

# Vidéo : durée maximale acceptée, pour que le traitement reste raisonnable
DUREE_MAX_VIDEO = 60

# Vidéo : une plaque suivie est lue au plus LECTURES_MAX fois, et plus du tout
# dès qu'une lecture conforme atteint LECTURE_SURE de confiance
LECTURES_MAX = 4
LECTURE_SURE = 0.8

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


def _aire(box):
    return (box[2] - box[0]) * (box[3] - box[1])


def _recouvrement(a, b):
    """Surface commune de deux boîtes (x1, y1, x2, y2)."""
    largeur = min(a[2], b[2]) - max(a[0], b[0])
    hauteur = min(a[3], b[3]) - max(a[1], b[1])
    return largeur * hauteur if largeur > 0 and hauteur > 0 else 0


def _iou(a, b):
    commun = _recouvrement(a, b)
    return commun / (_aire(a) + _aire(b) - commun) if commun else 0


def _sans_boites_imbriquees(boites):
    """Écarte les boîtes qui sont à l'intérieur d'une plus grande.

    Le modèle détecte parfois un morceau d'une plaque (les chiffres seuls, les lettres seules)
    en plus de la plaque entière : on ne garde que la plaque entière.
    """
    gardees = []
    for box, confiance in sorted(boites, key=lambda b: _aire(b[0]), reverse=True):
        if all(_recouvrement(box, g[0]) < 0.8 * _aire(box) for g in gardees):
            gardees.append((box, confiance))
    return gardees


def _trouver_boites(image):
    """Cherche les plaques dans une image. Renvoie une liste de (box, confiance YOLO)."""
    hauteur, largeur = image.shape[:2]
    boites = []

    for resultat in get_model().predict(image, verbose=False):
        for boite in resultat.boxes:
            x1, y1, x2, y2 = [int(v) for v in boite.xyxy[0].tolist()]
            # on reste dans l'image
            x1, y1 = max(x1, 0), max(y1, 0)
            x2, y2 = min(x2, largeur), min(y2, hauteur)
            if x2 > x1 and y2 > y1:
                boites.append(((x1, y1, x2, y2), float(boite.conf[0])))

    return _sans_boites_imbriquees(boites)


def _lire(image, box):
    x1, y1, x2, y2 = box
    return lire_plaque(image[y1:y2, x1:x2])


def _analyser(image):
    """Cherche les plaques d'une image et lit leur texte (utilisé pour les photos).

    Renvoie une liste de dictionnaires : numero, confidence (détection de la plaque),
    confiance_lecture, conforme (format malgache respecté) et box.
    """
    trouvees = []
    for box, confiance in _trouver_boites(image):
        lecture = _lire(image, box)
        trouvees.append({
            'numero': lecture['texte'],
            'confidence': confiance,
            'confiance_lecture': lecture['confiance'],
            'conforme': lecture['conforme'],
            'box': box,
        })
    return trouvees


def _dessiner(image, plaques):
    for p in plaques:
        x1, y1, x2, y2 = p['box']
        cv2.rectangle(image, (x1, y1), (x2, y2), VERT, 2)
        cv2.putText(image, p['numero'], (x1, max(y1 - 10, 20)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, VERT, 2)


def _sans_box(plaques):
    return [{
        'numero': p['numero'],
        'confidence': p['confidence'],
        'confiance_lecture': p['confiance_lecture'],
        'conforme': p['conforme'],
    } for p in plaques]


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


class _PlaqueSuivie:
    """Une plaque suivie d'une image à l'autre dans une vidéo.

    On garde toutes ses lectures et on choisit la meilleure à la fin : une plaque lue
    plusieurs fois donne un seul résultat, plus fiable qu'une lecture isolée.
    """

    def __init__(self, box, confiance):
        self.box = box
        self.confiance = confiance
        self.lectures = []
        self.vues = 1

    def a_lire_encore(self):
        if len(self.lectures) >= LECTURES_MAX:
            return False
        sure = any(l['conforme'] and l['confiance'] >= LECTURE_SURE for l in self.lectures)
        return not sure

    def meilleure_lecture(self):
        conformes = [l for l in self.lectures if l['conforme']]
        if conformes:
            # vote : le texte le plus lu, pondéré par la confiance de chaque lecture
            scores = {}
            for l in conformes:
                scores[l['texte']] = scores.get(l['texte'], 0) + l['confiance']
            texte = max(scores, key=scores.get)
            confiance = max(l['confiance'] for l in conformes if l['texte'] == texte)
            return {'texte': texte, 'confiance': confiance, 'conforme': True}

        lisibles = [l for l in self.lectures if l['texte'] != 'INCONNU']
        if lisibles:
            return max(lisibles, key=lambda l: l['confiance'])
        return {'texte': 'INCONNU', 'confiance': 0.0, 'conforme': False}


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

    Chaque plaque est suivie d'une image à l'autre et n'apparaît qu'une fois dans la liste,
    avec sa meilleure lecture.
    """
    lecture = cv2.VideoCapture(str(video_path))
    if not lecture.isOpened():
        raise ValueError("Vidéo illisible")

    largeur = int(lecture.get(cv2.CAP_PROP_FRAME_WIDTH))
    hauteur = int(lecture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = lecture.get(cv2.CAP_PROP_FPS) or 25
    nombre_images = lecture.get(cv2.CAP_PROP_FRAME_COUNT)

    if nombre_images and nombre_images / fps > DUREE_MAX_VIDEO:
        lecture.release()
        raise ValueError(f"Vidéo trop longue : {DUREE_MAX_VIDEO} secondes maximum")

    pas_analyse = max(1, round(fps / ANALYSES_PAR_SECONDE))

    nom = f"{uuid.uuid4().hex}.mp4"
    chemin_sortie = _dossier_sortie() / nom
    sortie = _ouvrir_ecriture_video(chemin_sortie, fps, (largeur, hauteur))

    suivies = []       # toutes les plaques vues dans la vidéo
    visibles = []      # plaques de la dernière analyse : (plaque suivie, box), redessinées entre deux analyses
    numero_image = 0

    try:
        while True:
            ok, image = lecture.read()
            if not ok:
                break

            if numero_image % pas_analyse == 0:
                visibles = []
                for box, confiance in _trouver_boites(image):
                    # est-ce une plaque déjà suivie ? (boîte qui se recouvre bien avec l'une d'elles)
                    candidates = [s for s in suivies
                                  if all(s is not v[0] for v in visibles) and _iou(s.box, box) >= 0.3]
                    if candidates:
                        plaque = max(candidates, key=lambda s: _iou(s.box, box))
                        plaque.box = box
                        plaque.vues += 1
                        plaque.confiance = max(plaque.confiance, confiance)
                    else:
                        plaque = _PlaqueSuivie(box, confiance)
                        suivies.append(plaque)

                    if plaque.a_lire_encore():
                        plaque.lectures.append(_lire(image, box))
                    visibles.append((plaque, box))

            _dessiner(image, [
                {'box': box, 'numero': p.meilleure_lecture()['texte']} for p, box in visibles
            ])
            sortie.write(image)
            numero_image += 1
    except Exception:
        # on ne laisse pas une vidéo à moitié écrite
        sortie.release()
        chemin_sortie.unlink(missing_ok=True)
        raise
    finally:
        lecture.release()
        sortie.release()

    # un seul résultat par numéro ; on écarte les détections vues une seule fois sans rien de conforme
    # (probablement de fausses détections) et les plaques illisibles
    resultats = {}
    for plaque in suivies:
        meilleure = plaque.meilleure_lecture()
        if meilleure['texte'] == 'INCONNU':
            continue
        if plaque.vues < 2 and not meilleure['conforme']:
            continue
        actuel = resultats.get(meilleure['texte'])
        if actuel is None or plaque.confiance > actuel['confidence']:
            resultats[meilleure['texte']] = {
                'numero': meilleure['texte'],
                'confidence': plaque.confiance,
                'confiance_lecture': meilleure['confiance'],
                'conforme': meilleure['conforme'],
            }

    return list(resultats.values()), _url_media(nom)
