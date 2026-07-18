import sqlite3


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

    def create_windshield(self, conn: sqlite3.Connection):
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
        # Return the newly created row so the route can return it
        new_id = cursor.lastrowid
        cursor.execute("SELECT * FROM windshields WHERE id = ?", (new_id,))
        return cursor.fetchone()
