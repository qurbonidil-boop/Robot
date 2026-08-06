"""Гӯш кардани овоз ва табдил ба матн (STT).

Google-и ройгон (recognize_google) забони "tg-TJ"-ро расман эълон
накардааст, бинобар ин аввал онро мекӯшем ва агар хидмат хато диҳад
(RequestError), худкор ба забони fallback (масалан "ru-RU") мегузарем.
Матни ба забони русӣ гуфташуда низ бирасад, AI (Claude) метавонад
бо тоҷикӣ ҷавоб диҳад — забони ҷавоб аз system prompt дар ai_chat.py
муайян мешавад, на аз забони STT.
"""

import speech_recognition as sr


class Listener:
    def __init__(self, language: str = "tg-TJ", fallback_language: str = "ru-RU"):
        self._recognizer = sr.Recognizer()
        self._microphone = sr.Microphone()
        self._language = language
        self._fallback_language = fallback_language
        with self._microphone as source:
            self._recognizer.adjust_for_ambient_noise(source, duration=1)

    def listen_once(self, timeout: float = 5.0, phrase_time_limit: float = 8.0):
        """Як ибораро гӯш мекунад ва матнро бармегардонад (ё None, агар чизе нафаҳмад)."""
        with self._microphone as source:
            try:
                audio = self._recognizer.listen(
                    source, timeout=timeout, phrase_time_limit=phrase_time_limit
                )
            except sr.WaitTimeoutError:
                return None

        try:
            return self._recognizer.recognize_google(audio, language=self._language)
        except sr.UnknownValueError:
            return None
        except sr.RequestError:
            if not self._fallback_language:
                return None
            try:
                return self._recognizer.recognize_google(
                    audio, language=self._fallback_language
                )
            except (sr.UnknownValueError, sr.RequestError):
                return None
