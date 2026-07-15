from typing import List

from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import RedirectResponse

from src.api.schema import WindshieldCreate, WindshieldResponse, WindshieldUpdate
from src.database.connect import create_db, get_db_connection
from src.database.create import CreateWindshield
from src.database.delete import DeleteWindshield
from src.database.read import GetWindshield
from src.database.update import UpdateWindshield

router = APIRouter(tags=["Password"])


@router.get("/windshield")
def get_windshields(): ...


@router.post("/windshield")
def create_windshield(): ...


@router.put("/windshield/{windshield_id}")
def update_windshield(windshield_id: int): ...


@router.delete("/windshield/{windshield_id}")
def delete_windshield(windshield_id: int): ...
