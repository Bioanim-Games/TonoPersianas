from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from fastapi import FastAPI
from api.core.security import configure_security
from api.db.schema import init_schema
from api.db.seed import seed_initial_data
from api.routers.catalog import router as catalog_router
from api.routers.contact import router as contact_router


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    init_schema()
    seed_initial_data()
    yield


app = FastAPI(
    title="Toño Persianas API",
    version="0.1.0",
    lifespan=lifespan,
)

configure_security(app)
app.include_router(catalog_router)
app.include_router(contact_router)


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "servicio": "FastAPI con uv y SQLite"}
