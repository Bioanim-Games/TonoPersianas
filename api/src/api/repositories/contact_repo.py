import sqlite3
from api.db.connection import get_db_connection
from api.schemas.contact import ContactInfoRead, ContactInfoUpdate

ALLOWED_UPDATE_COLUMNS: tuple[str, ...] = (
    "display_phone",
    "phone_href",
    "default_whatsapp_digits",
    "email",
    "email_href",
    "facebook_url",
    "instagram_url",
    "google_maps_url",
    "google_maps_embed_url",
)


def _row_to_contact_info(row: sqlite3.Row) -> ContactInfoRead:
    return ContactInfoRead(
        display_phone=str(row["display_phone"]),
        phone_href=str(row["phone_href"]),
        default_whatsapp_digits=str(row["default_whatsapp_digits"]),
        email=str(row["email"]),
        email_href=str(row["email_href"]),
        facebook_url=str(row["facebook_url"]),
        instagram_url=str(row["instagram_url"]),
        google_maps_url=str(row["google_maps_url"]),
        google_maps_embed_url=str(row["google_maps_embed_url"]),
    )


def get_contact_info() -> ContactInfoRead:
    """Return the singleton business contact info row from SQLite."""
    with get_db_connection() as conn:
        row = conn.execute(
            """
            SELECT
                display_phone, phone_href, default_whatsapp_digits,
                email, email_href, facebook_url, instagram_url,
                google_maps_url, google_maps_embed_url
            FROM business_contact_info
            WHERE id = 1
            LIMIT 1;
            """
        ).fetchone()
    if row is None:
        raise RuntimeError("business_contact_info row not initialized")
    return _row_to_contact_info(row)


def update_contact_info(payload: ContactInfoUpdate) -> ContactInfoRead:
    """Update provided fields in business_contact_info using parameterized SQL."""
    raw_updates = payload.model_dump(exclude_none=True, by_alias=False)
    assignments: list[str] = []
    params: list[object] = []

    for col in ALLOWED_UPDATE_COLUMNS:
        if col in raw_updates:
            assignments.append(f"{col} = ?")
            params.append(raw_updates[col])

    if assignments:
        assignments.append("updated_at = datetime('now')")
        sql = (
            f"UPDATE business_contact_info SET {', '.join(assignments)} "
            "WHERE id = 1;"
        )
        with get_db_connection() as conn:
            conn.execute(sql, tuple(params))

    return get_contact_info()
