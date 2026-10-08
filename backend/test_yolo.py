# test_yolo.py - Testez d'abord si votre modèle fonctionne
import cv2
from ultralytics import YOLO
import easyocr

print("1. Chargement du modèle YOLO...")
model = YOLO("D:/Projet_Nicolas/V2/Frontend/ALPR_Backend/models/best.pt")

print("2. Chargement d'EasyOCR...")
reader = easyocr.Reader(['fr'])

print("3. Test sur une image simple...")
image_path = "D:/Projet_Nicolas/V2/Frontend/ALPR_Backend/image/test2.jpg"
image = cv2.imread(image_path)

print("4. Détection...")
results = model(image)

for r in results:
    for box in r.boxes:
        xyxy = box.xyxy[0].tolist()
        confidence = float(box.conf[0])
        print(f"  Boîte détectée: {xyxy}, confiance: {confidence}")

print("✅ Test réussi!")

# Lancez-le
# python test_yolo.py