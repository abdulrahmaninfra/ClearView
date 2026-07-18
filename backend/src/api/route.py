import sqlite3
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException

from src.api.schema import WindshieldCreate, WindshieldResponse, WindshieldUpdate
from src.database.connect import get_db_connection
from src.database.create import CreateWindshield
from src.database.delete import DeleteWindshield
from src.database.read import GetWindshield
from src.database.update import UpdateWindshield

router = APIRouter(tags=["Windshields"])


@router.get("/windshield", response_model=List[WindshieldResponse])
def get_windshields(
    brand: Optional[str] = None,
    model: Optional[str] = None,
    year: Optional[int] = None,
    conn: sqlite3.Connection = Depends(get_db_connection),
):
    try:
        reader = GetWindshield(conn)
        windshields = reader.search_windshield(brand=brand, model=model, year=year)
        return [dict(row) for row in windshields]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/windshield/{windshield_id}", response_model=WindshieldResponse)
def get_windshield_by_id(
    windshield_id: int,
    conn: sqlite3.Connection = Depends(get_db_connection),
):
    try:
        windshield = GetWindshield(conn).get_windshield(windshield_id)
        if not windshield:
            raise HTTPException(status_code=404, detail="Windshield not found")
        return dict(windshield)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/windshield", response_model=WindshieldResponse, status_code=201)
def create_windshield(
    windshield: WindshieldCreate, conn: sqlite3.Connection = Depends(get_db_connection)
):
    try:
        new_item_payload = CreateWindshield(
            brand=windshield.brand,
            model=windshield.model,
            year=windshield.year,
            glass_type=windshield.glass_type,
            price=windshield.price,
            stock=windshield.stock,
        )
        new_windshield = new_item_payload.create_windshield(conn)
        return dict(new_windshield)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/windshield/{windshield_id}", response_model=WindshieldResponse)
def update_windshield(
    windshield_id: int,
    payload: WindshieldUpdate,
    conn: sqlite3.Connection = Depends(get_db_connection),
):
    try:
        reader = GetWindshield(conn)
        if not reader.get_windshield(windshield_id):
            raise HTTPException(status_code=404, detail="Windshield not found")

        UpdateWindshield(
            windshield_id=windshield_id,
            conn=conn,
            brand=payload.brand,
            model=payload.model,
            year=payload.year,
            glass_type=payload.glass_type,
            price=payload.price,
            stock=payload.stock,
        )

        updated_windshield = reader.get_windshield(windshield_id)
        return dict(updated_windshield)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/windshield/{windshield_id}")
def delete_windshield(
    windshield_id: int, conn: sqlite3.Connection = Depends(get_db_connection)
):
    try:
        reader = GetWindshield(conn)
        if not reader.get_windshield(windshield_id):
            raise HTTPException(status_code=404, detail="Windshield not found")
        deleter = DeleteWindshield(windshield_id, conn)
        deleter.delete()
        return {"message": f"Windshield with ID {windshield_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
