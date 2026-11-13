from typing import Literal
from pydantic import BaseModel, Field

LightControlType = Literal["traslucida", "semi-opaca", "blackout", "duo"]


class CategoryRead(BaseModel):
    id: int
    slug: str = Field(..., pattern=r"^[a-z0-9-]+$")
    name: str
    description: str
    display_order: int
    is_active: bool


class ProductRead(BaseModel):
    id: int
    category_id: int
    category_slug: str
    category_name: str
    sku: str
    slug: str = Field(..., pattern=r"^[a-z0-9-]+$")
    name: str
    short_description: str
    description: str
    light_control: LightControlType
    base_price_m2: float
    currency: str
    min_width_cm: int
    max_width_cm: int
    min_height_cm: int
    max_height_cm: int
    image_url: str
    is_featured: bool
    is_active: bool
