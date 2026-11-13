from fastapi import APIRouter
from api.repositories.contact_repo import get_contact_info, update_contact_info
from api.schemas.contact import ContactInfoRead, ContactInfoUpdate

router = APIRouter(prefix="/api", tags=["contact"])


@router.get(
    "/contact-info",
    response_model=ContactInfoRead,
    response_model_by_alias=True,
)
def read_business_contact_info() -> ContactInfoRead:
    return get_contact_info()


@router.put(
    "/contact-info",
    response_model=ContactInfoRead,
    response_model_by_alias=True,
)
def modify_business_contact_info(
    payload: ContactInfoUpdate,
) -> ContactInfoRead:
    return update_contact_info(payload)
