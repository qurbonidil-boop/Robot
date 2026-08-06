"""Гап задан (TTS) тавассути баландгӯяк."""

import pyttsx3


class Speaker:
    def __init__(self, rate: int = 165):
        self._engine = pyttsx3.init()
        self._engine.setProperty("rate", rate)

    def speak(self, text: str):
        if not text:
            return
        self._engine.say(text)
        self._engine.runAndWait()
