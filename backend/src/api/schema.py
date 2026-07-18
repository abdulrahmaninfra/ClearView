from typing import Optional

from pydantic import BaseModel, Field


class WindshieldCreate(BaseModel):
    brand: str
    model: str
    year: int
    glass_type: str
    price: float = Field(..., gt=0)
    stock: int = Field(..., ge=0)


class WindshieldUpdate(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    glass_type: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)


class WindshieldResponse(BaseModel):
    id: int
    brand: str
    model: str
    year: int
    glass_type: str
    price: float
    stock: int

    class Config:
        from_attributes = True  # Allows parsing from sqlite3.Row
