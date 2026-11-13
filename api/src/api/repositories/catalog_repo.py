import sqlite3
from api.db.connection import get_db_connection
from api.schemas.catalog import CategoryRead, ProductRead


def _row_to_category(row: sqlite3.Row) -> CategoryRead:
    return CategoryRead(
        id=int(row["id"]),
        slug=str(row["slug"]),
        name=str(row["name"]),
        description=str(row["description"]),
        display_order=int(row["display_order"]),
        is_active=bool(row["is_active"]),
    )


def _row_to_product(row: sqlite3.Row) -> ProductRead:
    return ProductRead(
        id=int(row["id"]),
        category_id=int(row["category_id"]),
        category_slug=str(row["category_slug"]),
        category_name=str(row["category_name"]),
        sku=str(row["sku"]),
        slug=str(row["slug"]),
        name=str(row["name"]),
        short_description=str(row["short_description"]),
        description=str(row["description"]),
        light_control=row["light_control"],
        base_price_m2=float(row["base_price_m2"]),
        currency=str(row["currency"]),
        min_width_cm=int(row["min_width_cm"]),
        max_width_cm=int(row["max_width_cm"]),
        min_height_cm=int(row["min_height_cm"]),
        max_height_cm=int(row["max_height_cm"]),
        image_url=str(row["image_url"]),
        is_featured=bool(row["is_featured"]),
        is_active=bool(row["is_active"]),
    )


def list_categories() -> list[CategoryRead]:
    """Return all active categories ordered by display_order."""
    with get_db_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, slug, name, description, display_order, is_active
            FROM categories
            WHERE is_active = 1
            ORDER BY display_order ASC, id ASC;
            """
        ).fetchall()
    return [_row_to_category(r) for r in rows]


def list_products(
    category_slug: str | None = None,
    featured_only: bool = False,
) -> list[ProductRead]:
    """Return active products with optional parameterized filters."""
    query = """
        SELECT
            p.id, p.category_id,
            c.slug AS category_slug,
            c.name AS category_name,
            p.sku, p.slug, p.name,
            p.short_description, p.description,
            p.light_control, p.base_price_m2, p.currency,
            p.min_width_cm, p.max_width_cm,
            p.min_height_cm, p.max_height_cm,
            p.image_url, p.is_featured, p.is_active
        FROM products p
        INNER JOIN categories c ON c.id = p.category_id
        WHERE p.is_active = 1 AND c.is_active = 1
    """
    params: list[object] = []

    if category_slug is not None:
        query += " AND c.slug = ?"
        params.append(category_slug)

    if featured_only:
        query += " AND p.is_featured = 1"

    query += " ORDER BY c.display_order ASC, p.id ASC;"

    with get_db_connection() as conn:
        rows = conn.execute(query, tuple(params)).fetchall()
    return [_row_to_product(r) for r in rows]


def get_product_by_slug(slug: str) -> ProductRead | None:
    """Return a single active product by its ASCII slug using bound parameters."""
    with get_db_connection() as conn:
        row = conn.execute(
            """
            SELECT
                p.id, p.category_id,
                c.slug AS category_slug,
                c.name AS category_name,
                p.sku, p.slug, p.name,
                p.short_description, p.description,
                p.light_control, p.base_price_m2, p.currency,
                p.min_width_cm, p.max_width_cm,
                p.min_height_cm, p.max_height_cm,
                p.image_url, p.is_featured, p.is_active
            FROM products p
            INNER JOIN categories c ON c.id = p.category_id
            WHERE p.slug = ? AND p.is_active = 1 AND c.is_active = 1
            LIMIT 1;
            """,
            (slug,),
        ).fetchone()
    return _row_to_product(row) if row is not None else None
