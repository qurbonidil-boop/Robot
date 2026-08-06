"""Пайваст ба Arduino тавассути USB Serial: фиристодани фармонҳо, гирифтани сенсор."""

import threading
import time

import serial


class MotionLink:
    def __init__(self, port: str, baud: int = 115200, on_obstacle=None, on_distance=None):
        self._serial = serial.Serial(port, baud, timeout=0.2)
        self._on_obstacle = on_obstacle
        self._on_distance = on_distance
        self._running = False
        self._reader_thread = None
        time.sleep(2)  # вақти бозоғозии Arduino баъд аз кушодани порт

    def start(self):
        self._running = True
        self._reader_thread = threading.Thread(target=self._read_loop, daemon=True)
        self._reader_thread.start()

    def stop(self):
        self._running = False
        if self._reader_thread:
            self._reader_thread.join(timeout=1)
        self.stop_moving()
        self._serial.close()

    def _read_loop(self):
        while self._running:
            try:
                line = self._serial.readline().decode("utf-8", errors="ignore").strip()
            except serial.SerialException:
                break
            if not line:
                continue
            if line == "OBSTACLE" and self._on_obstacle:
                self._on_obstacle()
            elif line.startswith("DIST:") and self._on_distance:
                try:
                    cm = int(line.split(":", 1)[1])
                    self._on_distance(cm)
                except ValueError:
                    pass

    def _send(self, command: str):
        self._serial.write((command + "\n").encode("utf-8"))

    def move(self, left: int, right: int):
        left = max(-255, min(255, int(left)))
        right = max(-255, min(255, int(right)))
        self._send(f"MOVE:{left},{right}")

    def stop_moving(self):
        self._send("STOP")

    def look(self, pan: int, tilt: int):
        pan = max(0, min(180, int(pan)))
        tilt = max(0, min(180, int(tilt)))
        self._send(f"HEAD:{pan},{tilt}")

    def set_eyes_color(self, r: int, g: int, b: int):
        self._send(f"EYES:{r},{g},{b}")

    def set_eyes_mode(self, mode: str):
        self._send(f"EYES:MODE:{mode.upper()}")
