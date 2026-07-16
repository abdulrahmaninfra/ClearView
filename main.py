from fastapi import FastAPI

from src.api.route import router
from src.database.connect import create_db

create_db()

app = FastAPI(title="ClearView Windshield API")
app.include_router(router)
