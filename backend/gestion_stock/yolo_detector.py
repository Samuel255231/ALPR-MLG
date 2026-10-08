import cv2
from ultralytics import YOLO

model = YOLO("datasets/runs/detect/train/weights/best.pt")
model1 = YOLO("datasetVraies/runs/detect/train2/weights/best.pt")
def detect_bigbags_video(video_path):
    bigbag_class_name = "bigbags"
    seen_ids = set()  
    results = model1.track(
        source=video_path,
        tracker="bytetrack.yaml",  
        stream=True                
    )

    for r in results:
        if r.boxes.id is not None: 
            for box, cls, obj_id in zip(r.boxes.xyxy, r.boxes.cls, r.boxes.id):
                if model.names[int(cls)] == bigbag_class_name:
                    seen_ids.add(int(obj_id))

    return len(seen_ids)

def detect_bigbags_image(image_path):
    bigbag_class_name = "bigbags"
    results = model.predict(source=image_path)
    count = 0

    for r in results:
        for cls in r.boxes.cls:
            if model.names[int(cls)] == bigbag_class_name:
                count += 1

    return count
