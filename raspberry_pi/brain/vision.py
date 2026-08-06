"""Камера ва шинохти оддии чеҳра (OpenCV, офлайн, бе интернет)."""

import threading
import time

import cv2


class FaceWatcher:
    def __init__(self, camera_index: int = 0, on_face_detected=None, scan_interval: float = 0.3):
        self._camera_index = camera_index
        self._on_face_detected = on_face_detected
        self._scan_interval = scan_interval
        self._cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )
        self._running = False
        self._thread = None

    def start(self):
        self._running = True
        self._thread = threading.Thread(target=self._loop, daemon=True)
        self._thread.start()

    def stop(self):
        self._running = False
        if self._thread:
            self._thread.join(timeout=1)

    def _loop(self):
        cap = cv2.VideoCapture(self._camera_index)
        try:
            while self._running:
                ok, frame = cap.read()
                if not ok:
                    time.sleep(self._scan_interval)
                    continue

                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                faces = self._cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

                if len(faces) > 0 and self._on_face_detected:
                    frame_width = frame.shape[1]
                    x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
                    face_center_x = x + w / 2
                    # -1.0 (сар аз чап) .. +1.0 (сар аз рост)
                    relative_x = (face_center_x / frame_width) * 2 - 1
                    self._on_face_detected(relative_x)

                time.sleep(self._scan_interval)
        finally:
            cap.release()
