from typing import Optional

from sqlcipher3 import dbapi2 as sqlite3


class GetWindshield:
    def __init__(self, conn: sqlite3.Connection):
        self.conn = conn

    def get_all_windshield(self):
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM windshields")
        return cursor.fetchall()

    def get_windshield(self, windshield_id: int):
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM windshields WHERE id = ?", (windshield_id,))
        return cursor.fetchone()

    def search_windshield(
        self,
        brand: Optional[str] = None,
        model: Optional[str] = None,
        year: Optional[int] = None,
    ):
        conditions = []
        params = []

        if brand is not None:
            conditions.append("brand LIKE ?")
            params.append(f"%{brand}%")

        if model is not None:
            conditions.append("model LIKE ?")
            params.append(f"%{model}%")

        if year is not None:
            conditions.append("year = ?")
            params.append(year)

        query = "SELECT * FROM windshields"
        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        cursor = self.conn.cursor()
        cursor.execute(query, params)
        return cursor.fetchall()

    def print_all_windshield(self):
        windshields = self.get_all_windshield()
        for windshield in windshields:
            print(
                f"ID: {windshield[0]}\n    Brand: {windshield[1]}\n    Model: {windshield[2]}\n    Year: {windshield[3]}\n    Glass Type: {windshield[4]}\n    Price: ${windshield[5]}\n    Stock: {windshield[6]}\n"
            )
