import sqlite3
from typing import Optional


class CreateWindshield:
    def __init__(
        self,
        brand: str,
        model: str,
        year: int,
        glass_type: str,
        price: float,
        stock: int,
    ):
        self.brand = brand
        self.model = model
        self.year = year
        self.glass_type = glass_type
        self.price = price
        self.stock = stock

    def create(self, conn: sqlite3.Connection) -> int:
        cursor = conn.cursor()
        new_element = (
            self.brand,
            self.model,
            self.year,
            self.glass_type,
            self.price,
            self.stock,
        )
        cursor.execute(
            "INSERT INTO windshields (brand, model, year, glass_type, price, stock) VALUES (?,?,?,?,?,?)",
            new_element,
        )
        conn.commit()
        return cursor.lastrowid
