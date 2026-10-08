import easyocr
import cv2
from ultralytics import YOLO
from .models import Plaque

reader = easyocr.Reader(['fr'])
model = YOLO("D:/Projet_Nicolas/V2/Frontend/ALPR_Backend/models/best.pt")

def detect_plate(image_path):
    results = model(image_path)
    image = cv2.imread(image_path)

    plates = []
    for r in results:
        for box in r.boxes:
            xyxy = box.xyxy[0].tolist()
            crop = image[int(xyxy[1]):int(xyxy[3]), int(xyxy[0]):int(xyxy[2])]
            text = reader.readtext(crop, detail=0)
            numero = text[0] if text else "inconnu"
            confidence = float(box.conf[0])

            # Dessiner rectangle + texte
            cv2.rectangle(image, (int(xyxy[0]), int(xyxy[1])), (int(xyxy[2]), int(xyxy[3])), (0, 255, 0), 2)
            cv2.putText(image, numero, (int(xyxy[0]), int(xyxy[1]) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

            plates.append({"numero": numero, "confidence": confidence})

    # Sauvegarder l’image annotée
    cv2.imwrite("media/annotated.jpg", image)

    return plates, "/media/annotated.jpg"


def detect_plate_video(video_path):
    cap = cv2.VideoCapture(video_path)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    out = cv2.VideoWriter("media/annotated_video.mp4", cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))
    plates = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        results = model.predict(frame)
        for r in results:
            for box in r.boxes:
                xyxy = box.xyxy[0].tolist()
                crop = frame[int(xyxy[1]):int(xyxy[3]), int(xyxy[0]):int(xyxy[2])]
                text = reader.readtext(crop, detail=0)
                numero = text[0] if text else "inconnu"
                confidence = float(box.conf[0])

                cv2.rectangle(frame, (int(xyxy[0]), int(xyxy[1])), (int(xyxy[2]), int(xyxy[3])), (0, 255, 0), 2)
                cv2.putText(frame, numero, (int(xyxy[0]), int(xyxy[1]) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

                plates.append({"numero": numero, "confidence": confidence})

    out.write(frame)
    cap.release()
    out.release()

    return plates, "/media/annotated_video.mp4"
