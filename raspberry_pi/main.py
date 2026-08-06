"""Нуқтаи оғози робот: ҳамаи қисмҳоро (гӯш, AI, гуфтор, дидан, ҳаракат) мепайвандад."""

import time

import yaml

from brain.ai_chat import AIChat
from brain.memory import Memory
from brain.motion_link import MotionLink
from brain.speech_to_text import Listener
from brain.text_to_speech import Speaker
from brain.vision import FaceWatcher

CONFIG_PATH = "config.yaml"

HEAD_TILT_CENTER = 90
HEAD_PAN_CENTER = 90
HEAD_PAN_RANGE = 60  # то чанд дараҷа сар аз марказ гардад
FACE_UPDATE_MIN_INTERVAL = 0.8  # сония, барои пешгирии ҳаракати аз ҳад зиёди сервомотор


def load_config():
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def main():
    config = load_config()
    memory = Memory()

    last_face_update = 0.0

    def on_obstacle():
        print("[ОГОҲӢ] Монеа наздик — ҳаракат бозистонида шуд.")

    def on_distance(cm):
        pass  # метавонед барои debug фаъол кунед: print(f"Масофа: {cm} см")

    motion = MotionLink(
        port=config["serial_port"],
        baud=config.get("serial_baud", 115200),
        on_obstacle=on_obstacle,
        on_distance=on_distance,
    )
    motion.start()
    motion.look(HEAD_PAN_CENTER, HEAD_TILT_CENTER)
    motion.set_eyes_mode("IDLE")

    def on_face_detected(relative_x: float):
        nonlocal last_face_update
        now = time.time()
        if now - last_face_update < FACE_UPDATE_MIN_INTERVAL:
            return
        last_face_update = now
        pan = HEAD_PAN_CENTER - relative_x * HEAD_PAN_RANGE
        motion.look(pan, HEAD_TILT_CENTER)

    vision = FaceWatcher(
        camera_index=config.get("camera_index", 0),
        on_face_detected=on_face_detected,
    )
    vision.start()

    listener = Listener(
        language=config.get("language", "tg-TJ"),
        fallback_language=config.get("fallback_language", "ru-RU"),
    )
    speaker = Speaker(language=config.get("tts_language", "tg"))
    ai = AIChat(api_key=config["anthropic_api_key"], robot_name=config.get("robot_name", "Робот"))

    print("Робот омода аст. Гап занед...")

    try:
        while True:
            motion.set_eyes_mode("LISTEN")
            text = listener.listen_once()
            if not text:
                continue

            print(f"Шумо: {text}")
            memory.add_message("user", text)

            motion.set_eyes_mode("THINK")
            history = memory.recent_history(limit=10)[:-1]  # бе паёми охирин (аллакай дар user_text)
            response = ai.get_response(text, history)
            print(f"Робот: {response}")
            memory.add_message("assistant", response)

            motion.set_eyes_mode("TALK")
            speaker.speak(response)
    except KeyboardInterrupt:
        print("\nХомӯш шудан...")
    finally:
        vision.stop()
        motion.stop_moving()
        motion.set_eyes_mode("IDLE")
        motion.stop()
        memory.close()


if __name__ == "__main__":
    main()
