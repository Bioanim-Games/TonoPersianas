from api.db.connection import get_db_connection

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    light_control TEXT NOT NULL CHECK (light_control IN ('traslucida', 'semi-opaca', 'blackout', 'duo')),
    base_price_m2 REAL NOT NULL CHECK (base_price_m2 >= 0),
    currency TEXT NOT NULL DEFAULT 'MXN',
    min_width_cm INTEGER NOT NULL DEFAULT 40,
    max_width_cm INTEGER NOT NULL DEFAULT 300,
    min_height_cm INTEGER NOT NULL DEFAULT 40,
    max_height_cm INTEGER NOT NULL DEFAULT 350,
    image_url TEXT NOT NULL,
    is_featured INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

CREATE TABLE IF NOT EXISTS business_contact_info (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    display_phone TEXT NOT NULL,
    phone_href TEXT NOT NULL,
    default_whatsapp_digits TEXT NOT NULL,
    email TEXT NOT NULL,
    email_href TEXT NOT NULL,
    facebook_url TEXT NOT NULL,
    instagram_url TEXT NOT NULL,
    google_maps_url TEXT NOT NULL,
    google_maps_embed_url TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
"""


def init_schema() -> None:
    """Create SQLite tables and indexes if they do not exist."""
    with get_db_connection() as conn:
        conn.executescript(SCHEMA_SQL)
