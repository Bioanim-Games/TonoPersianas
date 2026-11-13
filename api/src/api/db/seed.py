from api.db.connection import get_db_connection

INITIAL_CATEGORIES: tuple[tuple[str, str, str, int], ...] = (
    (
        "sheer-elegance",
        "Persianas Sheer Elegance (Dúo)",
        "Franjas horizontales alternadas que permiten modular la luz natural y la privacidad con total suavidad.",
        1,
    ),
    (
        "enrollables-blackout",
        "Persianas Enrollables Blackout",
        "Bloqueo total de luz y aislamiento térmico ideal para recámaras principales y salas de proyección.",
        2,
    ),
    (
        "enrollables-traslucidas",
        "Persianas Enrollables Traslúcidas",
        "Tejidos arquitectónicos con filtro solar que iluminan tus espacios protegiendo tus muebles de los rayos UV.",
        3,
    ),
    (
        "shangri-la-romanas",
        "Persianas Shangri-La y Romanas",
        "Acabados textiles de alta costura que combinan la calidez de una cortina con la precisión de una persiana.",
        4,
    ),
)

INITIAL_PRODUCTS: tuple[
    tuple[str, str, str, str, str, str, str, float, str, int], ...
] = (
    (
        "sheer-elegance",
        "TP-SHEER-001",
        "persiana-sheer-elegance-imperial",
        "Persiana Sheer Elegance Imperial",
        "Doble tejido en tono espresso y lino cálido con control milimétrico de luz.",
        "Nuestra persiana insignia de Toño Persianas. Combina franjas opacas de tejido texturizado con malla traslúcida de alta definición para lograr ambientes serenos y sofisticados.",
        "duo",
        1450.0,
        "/assets/sheer-elegance-imperial.jpg",
        1,
    ),
    (
        "sheer-elegance",
        "TP-SHEER-002",
        "persiana-sheer-elegance-arena",
        "Persiana Sheer Elegance Arena",
        "Acabado en tonos alabastro y champaña para estancias luminosas.",
        "Diseñada para integrarse en muros claros y maderas naturales, ofreciendo transición suave entre vista exterior e intimidad interior.",
        "duo",
        1390.0,
        "/assets/sheer-elegance-arena.jpg",
        1,
    ),
    (
        "enrollables-blackout",
        "TP-BLK-001",
        "persiana-enrollable-blackout-nocturna",
        "Persiana Enrollable Blackout Nocturna",
        "Oscuridad total al 100% con recubrimiento térmico acústico.",
        "Ideal para un descanso profundo en recámaras. Su tejido multicapa bloquea el paso de luz solar y reduce el calor interior.",
        "blackout",
        1250.0,
        "/assets/enrollable-blackout-nocturna.jpg",
        1,
    ),
    (
        "enrollables-blackout",
        "TP-BLK-002",
        "persiana-enrollable-blackout-lino",
        "Persiana Enrollable Blackout Textura Lino",
        "Bloqueo total de luz con elegante textura orgánica tipo lino.",
        "Une la funcionalidad absoluta del blackout con una cara interior cálida y textil que viste tus ventanales con distinción.",
        "blackout",
        1320.0,
        "/assets/enrollable-blackout-lino.jpg",
        0,
    ),
    (
        "enrollables-traslucidas",
        "TP-TRS-001",
        "persiana-screen-solar-arquitectonica",
        "Persiana Screen Solar Arquitectónica 5%",
        "Control solar inteligente que conserva la vista hacia el exterior.",
        "Tejido técnico microperforado que filtra el deslumbramiento y bloquea hasta el 95% de los rayos UV sin perder conexión visual con tu jardín o terraza.",
        "traslucida",
        1180.0,
        "/assets/screen-solar-arquitectonica.jpg",
        1,
    ),
    (
        "shangri-la-romanas",
        "TP-SHG-001",
        "persiana-shangri-la-seda-real",
        "Persiana Shangri-La Seda Real",
        "Láminas textiles suspendidas entre dos velos traslúcidos.",
        "La máxima expresión de elegancia para salas y comedores de lujo, suavizando la entrada de luz con un efecto etéreo inigualable.",
        "semi-opaca",
        1890.0,
        "/assets/shangri-la-seda-real.jpg",
        1,
    ),
)


def seed_initial_data() -> None:
    """Seed Toño Persianas categories and products if the database is empty."""
    with get_db_connection() as conn:
        row = conn.execute("SELECT COUNT(*) AS count FROM categories;").fetchone()
        if row and int(row["count"]) > 0:
            return

        conn.executemany(
            """
            INSERT INTO categories (slug, name, description, display_order)
            VALUES (?, ?, ?, ?);
            """,
            INITIAL_CATEGORIES,
        )

        category_rows = conn.execute(
            "SELECT id, slug FROM categories;"
        ).fetchall()
        category_map = { str(r["slug"]): int(r["id"]) for r in category_rows }

        for (
            cat_slug,
            sku,
            slug,
            name,
            short_desc,
            desc,
            light_control,
            base_price_m2,
            image_url,
            is_featured,
        ) in INITIAL_PRODUCTS:
            conn.execute(
                """
                INSERT INTO products (
                    category_id, sku, slug, name, short_description,
                    description, light_control, base_price_m2, image_url, is_featured
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """,
                (
                    category_map[cat_slug],
                    sku,
                    slug,
                    name,
                    short_desc,
                    desc,
                    light_control,
                    base_price_m2,
                    image_url,
                    is_featured,
                ),
            )
