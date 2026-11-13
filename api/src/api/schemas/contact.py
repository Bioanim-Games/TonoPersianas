from pydantic import BaseModel, ConfigDict, Field


class ContactInfoRead(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    display_phone: str = Field(..., serialization_alias="displayPhone")
    phone_href: str = Field(..., serialization_alias="phoneHref")
    default_whatsapp_digits: str = Field(
        ..., serialization_alias="defaultWhatsappDigits"
    )
    email: str
    email_href: str = Field(..., serialization_alias="emailHref")
    facebook_url: str = Field(..., serialization_alias="facebookUrl")
    instagram_url: str = Field(..., serialization_alias="instagramUrl")
    google_maps_url: str = Field(..., serialization_alias="googleMapsUrl")
    google_maps_embed_url: str = Field(
        ..., serialization_alias="googleMapsEmbedUrl"
    )


class ContactInfoUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    display_phone: str | None = Field(default=None, alias="displayPhone")
    phone_href: str | None = Field(default=None, alias="phoneHref")
    default_whatsapp_digits: str | None = Field(
        default=None,
        alias="defaultWhatsappDigits",
        pattern=r"^[0-9]{10,15}$",
    )
    email: str | None = None
    email_href: str | None = Field(default=None, alias="emailHref")
    facebook_url: str | None = Field(default=None, alias="facebookUrl")
    instagram_url: str | None = Field(default=None, alias="instagramUrl")
    google_maps_url: str | None = Field(default=None, alias="googleMapsUrl")
    google_maps_embed_url: str | None = Field(
        default=None, alias="googleMapsEmbedUrl"
    )
