import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]
DEFAULT_DB_PATH = BASE_DIR / "data" / "tono_persianas.db"


class Settings:
    """Environment-driven application & security settings."""

    def __init__(self) -> None:
        self.environment: str = os.getenv("ENVIRONMENT", "development")
        self.database_path: Path = Path(
            os.getenv("DATABASE_PATH", str(DEFAULT_DB_PATH))
        )
        raw_origins = os.getenv(
            "ALLOWED_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174",
        )
        self.allowed_origins: list[str] = [
            origin.strip() for origin in raw_origins.split(",") if origin.strip()
        ]


settings = Settings()
