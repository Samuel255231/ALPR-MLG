# ALPR_MLG

Système de reconnaissance automatique de plaques d'immatriculation malgaches (ALPR).

On envoie une **image ou une vidéo** ; le système trouve les plaques (YOLO), lit leur texte (EasyOCR),
l'enregistre en base de données (PostgreSQL) et l'affiche dans une interface web (React) avec un dashboard
de statistiques et un historique des détections.

Projet de fin d'année, M1 IA (parcours Gouvernance et Ingénierie des Données), École Nationale d'Informatique,
Université de Fianarantsoa.

## Comment ça marche

```text
Image / vidéo ──► Django (API) ──► YOLO : repère la plaque ──► EasyOCR : lit le texte
                       │                                            │
                       │                       corrige selon le format malgache (4 chiffres + 2 ou 3 lettres)
                       ▼                                            ▼
                 PostgreSQL  ◄────────────── une ligne par détection (reconnue / à vérifier / illisible)
                       ▲
        React (dashboard, historique, analyse, caméras, zones, utilisateurs)
```

Une plaque est **reconnue** quand son texte respecte le format malgache (ex. `1844 TAH`, `0904 FG`) et que la lecture
est assez sûre. Sinon elle est **à vérifier** (lecture partielle ou douteuse) ou **illisible**.

## Ce qu'il faut avant de commencer

| Outil | Version utilisée |
|---|---|
| Python | 3.11 |
| Node.js | 24 (20 ou plus devrait convenir) |
| PostgreSQL | 17 |
| Place disque | environ 4 Go (PyTorch, modèles EasyOCR, `node_modules`) |

Il faut aussi le fichier du modèle YOLO **`best.pt`** (environ 43 Mo). Il n'est pas dans Git (trop lourd) :
demandez-le à l'équipe et placez-le dans `backend/models/best.pt`.

## Installation

### 1. Base de données

Créez la base (le mot de passe de l'utilisateur `postgres` vous est demandé) :

```powershell
psql -U postgres -c "CREATE DATABASE alpr_mlg ENCODING 'UTF8';"
```

### 2. Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Copiez le modèle de configuration puis remplissez-le :

```powershell
copy .env.example .env
```

Dans `backend\.env`, renseignez au minimum :

* `SECRET_KEY` : générez-la avec
  `python -c "from django.core.management.utils import get_random_secret_key as k; print(k())"` ;
* `DB_PASSWORD` : le mot de passe de l'utilisateur `postgres` (le même que pour pgAdmin) ;
* `ADMIN_PASSWORD` : le mot de passe du premier administrateur.

Puis créez les tables et le premier compte :

```powershell
python manage.py migrate
python manage.py seed_users
python manage.py runserver 8000
```

L'API tourne sur http://localhost:8000. Le **premier lancement d'une analyse** télécharge les modèles d'EasyOCR
(environ 100 Mo, une seule fois) et prend donc plus longtemps.

### 3. Frontend

Dans un second terminal :

```powershell
cd frontend
npm install
npm run dev
```

L'application est sur http://localhost:5173. Si le backend n'est pas sur `http://localhost:8000`, copiez
`frontend\.env.example` en `frontend\.env` et changez `VITE_API_URL`.

## Première utilisation

1. Connectez-vous avec `admin` et le mot de passe `ADMIN_PASSWORD`.
2. Page **Zone** : ajoutez une zone (par exemple « Entrée principale »).
3. Page **Gestion caméras** : ajoutez une caméra liée à cette zone.
4. Page **Analyse ALPR** : choisissez la caméra et envoyez une image ou une vidéo (60 secondes au maximum).
5. Consultez le **Dashboard** et l'**Historique des détections** (filtres par plaque, caméra et date, export PDF).
6. Page **Utilisateurs** : créez les comptes de vos collègues.

Des images de test se trouvent dans `backend/image/` chez le développeur (dossier non versionné).

## Rôles

| | Administrateur | Opérateur |
|---|---|---|
| Dashboard et historique des détections | oui | oui |
| Analyser une image ou une vidéo | oui | oui |
| Voir les caméras et les zones | oui | oui |
| Ajouter, modifier, supprimer caméras et zones | oui | non |
| Gérer les utilisateurs (créer, activer, réinitialiser) | oui | non |

## Les principales routes de l'API

Tout demande une connexion (jeton JWT), sauf la connexion elle-même.

| Route | Rôle |
|---|---|
| `POST /users/login/` | Connexion, renvoie les jetons et le rôle |
| `POST /alpr/detect/` | Envoie `file` et `camera_id`, renvoie les plaques lues |
| `GET /alpr/detections/` | Historique des détections |
| `GET /alpr/totals/`, `/alpr/chart_data/`, `/alpr/dashboard/...` | Statistiques du dashboard |
| `/cameras/`, `/zones/` | Lecture pour tous, écriture pour l'administrateur |
| `/users/`, `/users/registration/`, ... | Administration des comptes (administrateur) |

## Tests et vérifications

```powershell
# backend (dans backend/, venv activé) : 56 tests, quelques secondes
python manage.py test

# frontend (dans frontend/)
npm run lint
npm run build
```

Les tests du backend créent une base temporaire `test_alpr_mlg` et la suppriment ensuite. Le détecteur est simulé :
ils ne chargent ni YOLO ni EasyOCR.

## Structure du dépôt

```text
backend/
  config/       réglages Django (lit le fichier .env), routes
  alpr/         détections : modèle Plaque, API, services/ (detector, ocr, plaque_mg), tests/
  camera/       caméras         zone/    zones de surveillance         users/   comptes et rôles
  models/       best.pt (modèle YOLO, non versionné)
frontend/
  src/pages/        analyse, dashboard, detections, camera, zone, users, login
  src/redux/        états et appels à l'API     src/api/   client unique (jeton JWT)
  src/components/   interface (shadcn/ui) et graphiques
```

## Limites connues

* La lecture du texte n'est pas parfaite : sur nos plaques d'essai, environ 7 sur 10 sont lues exactement.
  Les plaques floues, sombres ou très petites restent difficiles (elles sont alors marquées « à vérifier »).
  Plus d'images de plaques malgaches pour ré-entraîner le modèle amélioreraient surtout ce point.
* L'analyse d'une vidéo prend de 30 secondes à quelques minutes (le calcul se fait sur le processeur).
* Seules les images et vidéos déjà enregistrées sont analysées, pas de flux caméra en direct.
* Le jeton de connexion expire au bout d'une heure : il faut se reconnecter.
* Les images annotées s'accumulent dans `backend/media/annotated/` (pas de nettoyage automatique).

## En cas de problème

| Symptôme | Cause probable |
|---|---|
| `UnicodeDecodeError ... 0xe9` au démarrage de Django | Le mot de passe de `DB_PASSWORD` est faux (le vrai message d'erreur de PostgreSQL est en français et mal décodé) |
| `SECRET_KEY manquante` | Le fichier `backend\.env` n'existe pas ou n'a pas de `SECRET_KEY` |
| `Modèle YOLO introuvable` (erreur 503) | `best.pt` n'est pas dans `backend/models/` |
| Erreur au chargement de `cv2` | `opencv-python` et `opencv-python-headless` ne sont pas à la même version : `pip install opencv-python-headless==4.12.0.88` puis `pip install --force-reinstall --no-deps opencv-python==4.12.0.88` |
| La page se recharge toute seule vers la connexion | Le jeton a expiré : reconnectez-vous |
