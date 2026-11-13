# Specification: Business Contact Info SQLite Table & API (`api/`)

## 1. Scope & Impact Summary
- **Target Subproject**: `api/` (strictly 1 folder at a time — Rule 6)
- **Total Files Affected**: **6 files** in `api/` (`3` new, `3` modified)
- **File List & Estimated Line Counts (Max 400 lines/file — Rule 5)**:
  1. `[MODIFY]` `api/src/api/db/schema.py` — Add `CREATE TABLE IF NOT EXISTS business_contact_info` with singleton constraint `CHECK (id = 1)`.
  2. `[MODIFY]` `api/src/api/db/seed.py` — Independently seed `business_contact_info` on startup if the table is empty so existing `.db` files receive the contact info row automatically.
  3. `[NEW]` `api/src/api/schemas/contact.py` — `ContactInfoRead` and `ContactInfoUpdate` Pydantic schemas with `camelCase` JSON serialization matching `ui/src/config/contactConfig.ts`.
  4. `[NEW]` `api/src/api/repositories/contact_repo.py` — Parameterized SQLite queries `get_contact_info()` and `update_contact_info()`.
  5. `[NEW]` `api/src/api/routers/contact.py` — FastAPI router exposing `GET /api/contact-info` and `PUT /api/contact-info`.
  6. `[MODIFY]` `api/main.py` — Register `contact_router`.

---

## 2. Functional Requirements & Acceptance Criteria

| ID | Requirement | Acceptance Criteria |
| :--- | :--- | :--- |
| **REQ-1** | **Singleton Contact Info SQLite Table** | `business_contact_info` enforces `id = 1` so there is always a single canonical row for **Toño Persianas** contact details. |
| **REQ-2** | **Independent Startup Seeding** | Even when `categories` and `products` are already populated in `api/data/tono_persianas.db`, `seed_initial_data()` checks `business_contact_info` separately and seeds `+52 33 3377 3415`, `tpersianas@gmail.com`, Facebook, Instagram, and Google Maps URLs if empty. |
| **REQ-3** | **Frontend-Compatible JSON Contract** | `GET /api/contact-info` returns camelCase keys (`displayPhone`, `phoneHref`, `defaultWhatsappDigits`, `email`, `emailHref`, `facebookUrl`, `instagramUrl`, `googleMapsUrl`, `googleMapsEmbedUrl`) matching `ContactInfoData` in `ui/src/config/contactConfig.ts`. |
| **REQ-4** | **Updatable Contact & WhatsApp Test Number** | `PUT /api/contact-info` updates any provided contact field (such as `defaultWhatsappDigits` for personal phone testing) using parameterized SQL `?` placeholders. |
