# Specification: SQLite Database, Security Foundation & Products/Categories Catalog (`api/`)

## 1. Scope & Impact Summary
- **Target Subproject**: `api/` (strictly 1 folder at a time — Rule 6)
- **Total Files Affected**: **10 files** in `api/` (`9` new, `1` modified)
- **New Dependencies**: **0** (uses Python 3.14's built-in `sqlite3` + FastAPI's bundled `pydantic`)
- **File List & Estimated Line Counts (Max 400 lines/file — Rule 5)**:
  1. `[NEW]` `api/.gitignore` — Ignores `.venv/`, `__pycache__/`, `.env`, and `data/*.db`.
  2. `[NEW]` `api/src/api/core/config.py` — Environment-driven settings (`DATABASE_PATH`, `ALLOWED_ORIGINS`, `ENVIRONMENT`).
  3. `[NEW]` `api/src/api/core/security.py` — Security headers middleware (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) and `CORSMiddleware`.
  4. `[NEW]` `api/src/api/db/connection.py` — Context-managed SQLite connection with `sqlite3.Row` and `PRAGMA foreign_keys = ON`.
  5. `[NEW]` `api/src/api/db/schema.py` — Creates the `categories` and `products` SQL tables and indexes.
  6. `[NEW]` `api/src/api/db/seed.py` — Idempotent startup seeder populating 4 **Toño Persianas** categories and 6 luxury blind products using parameterized `INSERT` statements.
  7. `[NEW]` `api/src/api/schemas/catalog.py` — Pydantic response models (`CategoryRead`, `ProductRead`) and `LightControlType` literal type.
  8. `[NEW]` `api/src/api/repositories/catalog_repo.py` — Parameterized SQLite data-access methods (`list_categories`, `list_products`, `get_product_by_slug`), isolated for future migration to `SQLModel` / `SQLAlchemy`.
  9. `[NEW]` `api/src/api/routers/catalog.py` — FastAPI router exposing `GET /api/categories`, `GET /api/products`, and `GET /api/products/{slug}` with strict regex slug validation.
  10. `[MODIFY]` `api/main.py` — Lifespan database initialization/seeding, security middleware registration, and router mounting.

---

## 2. Functional Requirements & Acceptance Criteria

| ID | Requirement | Acceptance Criteria |
| :--- | :--- | :--- |
| **REQ-1** | **Automatic Schema & Seed Initialization** | On FastAPI startup (`lifespan`), `api/data/tono_persianas.db` is created automatically, `categories` and `products` tables are initialized, and sample data is seeded if and only if `categories` is empty. |
| **REQ-2** | **Safe `ñ` & Accent Separation** | All SQL identifiers, `slug` values (`'sheer-elegance'`, `'enrollables-blackout'`), and `sku` codes (`'TP-SHEER-001'`) use pure ASCII. Spanish `ñ` and accents (`"Toño Persianas"`, `"Persianas Sheer Elegance (Dúo)"`) are used only in display text columns (`name`, `short_description`, `description`). |
| **REQ-3** | **Parameterized SQL & Input Validation** | Every SQL query in `catalog_repo.py` uses `?` bound parameters. `slug` and `category_slug` parameters in `routers/catalog.py` validate `pattern=r"^[a-z0-9-]+$"`, returning `422 Unprocessable Entity` on invalid characters. |
| **REQ-4** | **Security Headers & CORS** | Every HTTP response includes `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy: geolocation=(), microphone=(), camera=()`. |
| **REQ-5** | **Catalog Endpoints** | `GET /api/categories` returns active categories ordered by `display_order`. `GET /api/products` supports optional `category_slug` and `featured_only` filters. `GET /api/products/{slug}` returns a single product or `404 Not Found`. |
| **REQ-6** | **400-Line Limit & Single-Folder Scope** | All 10 files reside inside `api/`, and every file is strictly under 400 lines. |
