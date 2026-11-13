from fastapi import APIRouter, HTTPException, Path, Query, status
from api.repositories.catalog_repo import (
    get_product_by_slug,
    list_categories,
    list_products,
)
from api.schemas.catalog import CategoryRead, ProductRead

router = APIRouter(prefix="/api", tags=["catalog"])

SLUG_PATTERN = r"^[a-z0-9-]+$"


@router.get("/categories", response_model=list[CategoryRead])
def get_categories() -> list[CategoryRead]:
    return list_categories()


@router.get("/products", response_model=list[ProductRead])
def get_products(
    category_slug: str | None = Query(
        default=None,
        pattern=SLUG_PATTERN,
        max_length=64,
        description="Filtrar por slug ASCII de categoría",
    ),
    featured_only: bool = Query(
        default=False,
        description="Mostrar únicamente productos destacados",
    ),
) -> list[ProductRead]:
    return list_products(
        category_slug=category_slug,
        featured_only=featured_only,
    )


@router.get("/products/{slug}", response_model=ProductRead)
def get_product_detail(
    slug: str = Path(
        ...,
        pattern=SLUG_PATTERN,
        max_length=80,
        description="Slug ASCII único del producto",
    ),
) -> ProductRead:
    product = get_product_by_slug(slug)
    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )
    return product
