"""Хотираи оддии робот: таърихи сӯҳбат ва профили корбар дар SQLite."""

import sqlite3
import time
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "robot_memory.db"


class Memory:
    def __init__(self, db_path: Path = DB_PATH):
        self._conn = sqlite3.connect(db_path, check_same_thread=False)
        self._create_tables()

    def _create_tables(self):
        self._conn.execute(
            """
            CREATE TABLE IF NOT EXISTS conversation (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at REAL NOT NULL
            )
            """
        )
        self._conn.execute(
            """
            CREATE TABLE IF NOT EXISTS profile (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
            """
        )
        self._conn.commit()

    def add_message(self, role: str, content: str):
        self._conn.execute(
            "INSERT INTO conversation (role, content, created_at) VALUES (?, ?, ?)",
            (role, content, time.time()),
        )
        self._conn.commit()

    def recent_history(self, limit: int = 10):
        rows = self._conn.execute(
            "SELECT role, content FROM conversation ORDER BY id DESC LIMIT ?",
            (limit,),
        ).fetchall()
        return [{"role": role, "content": content} for role, content in reversed(rows)]

    def set_profile(self, key: str, value: str):
        self._conn.execute(
            "INSERT INTO profile (key, value) VALUES (?, ?) "
            "ON CONFLICT(key) DO UPDATE SET value=excluded.value",
            (key, value),
        )
        self._conn.commit()

    def get_profile(self, key: str, default=None):
        row = self._conn.execute(
            "SELECT value FROM profile WHERE key = ?", (key,)
        ).fetchone()
        return row[0] if row else default

    def close(self):
        self._conn.close()
