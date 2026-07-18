import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from src.api.route import router
from src.core.config import Settings
from src.database.connect import create_db

settings = Settings()


def create_application() -> FastAPI:
    create_db()
    application = FastAPI(
        title=settings.API_TITLE,
        description=settings.API_DESCRIPTION,
        version=settings.API_VERSION,
    )
    application.add_middleware(GZipMiddleware, minimum_size=1000)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=settings.ALLOWED_METHODS,
        allow_headers=["*"],
        max_age=86400,
    )
    application.include_router(router)

    return application


app = create_application()

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT)
