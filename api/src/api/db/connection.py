import sqlite3
from collections.abc import Iterator
from contextlib import contextmanager
from pathlib import Path
from api.core.config import settings


def get_database_path() -> Path:
    """Ensure parent directory exists and return SQLite file path."""
    db_path = settings.database_path
    db_path.parent.mkdir(parents=True, exist_ok=True)
    return db_path


@contextmanager
def get_db_connection() -> Iterator[sqlite3.Connection]:
    """Yield a SQLite connection configured with Row factory and foreign keys."""
    conn = sqlite3.connect(get_database_path())
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
