"""Гап задан (TTS) тавассути баландгӯяк.

pyttsx3 дар Raspberry Pi аз болои espeak-ng кор мекунад. espeak-ng якчанд
даҳҳо забонро дастгирӣ мекунад, аз ҷумла тоҷикиро ("tg"), лекин овозаш
"роботона" садо медиҳад (синтези қоидавӣ, на нейронӣ) — барои версияи 1
кофист. Агар овози тоҷикӣ дар системаи шумо насб набошад, автомат ба
овози пешфарз мегузарад ва огоҳӣ чоп мекунад.
"""

import pyttsx3


class Speaker:
    def __init__(self, rate: int = 165, language: str = "tg"):
        self._engine = pyttsx3.init()
        self._engine.setProperty("rate", rate)
        self._select_voice(language)

    def _select_voice(self, language: str):
        for voice in self._engine.getProperty("voices"):
            langs = " ".join(str(l) for l in (voice.languages or [])).lower()
            if language.lower() in voice.id.lower() or language.lower() in langs:
                self._engine.setProperty("voice", voice.id)
                return
        print(
            f"[Огоҳӣ] Овози забони '{language}' дар система ёфт нашуд — овози "
            "пешфарз истифода мешавад. Барои насби овози тоҷикӣ: "
            "'sudo apt install espeak-ng-data' ва санҷед 'espeak-ng --voices' "
            "оё 'tg' дар рӯйхат ҳаст."
        )

    def speak(self, text: str):
        if not text:
            return
        self._engine.say(text)
        self._engine.runAndWait()
