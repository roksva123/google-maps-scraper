import json
import sqlite3
from pathlib import Path
from typing import Any

DB_PATH = Path(__file__).with_name("history.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS search_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                keyword TEXT NOT NULL,
                limit_count INTEGER NOT NULL,
                result_count INTEGER NOT NULL,
                results_json TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.commit()


def save_search(keyword: str, limit_count: int, results: list[dict[str, Any]]):
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO search_history (keyword, limit_count, result_count, results_json)
            VALUES (?, ?, ?, ?)
            """,
            (keyword, limit_count, len(results), json.dumps(results, ensure_ascii=False)),
        )
        conn.commit()
        return cursor.lastrowid


def get_history(limit: int = 20):
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, keyword, limit_count, result_count, results_json, created_at
            FROM search_history
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()

    history = []
    for row in rows:
        history.append(
            {
                "id": row["id"],
                "keyword": row["keyword"],
                "limit": row["limit_count"],
                "count": row["result_count"],
                "results": json.loads(row["results_json"]),
                "created_at": row["created_at"],
            }
        )
    return history


def clear_history():
    with get_connection() as conn:
        conn.execute("DELETE FROM search_history")
        conn.commit()
