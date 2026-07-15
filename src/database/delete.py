import sqlite3

from .connect import conn, cursor


class DeleteWindshield:
    def __init__(self, windshield_id: int):
        self.windshield_id = windshield_id

    def delete(self):
        try:
            cursor.execute(
                "DELETE FROM windshields WHERE id = ?", (self.windshield_id,)
            )
            conn.commit()
        except sqlite3.Error as e:
            print(f"Error deleting windshield: {e}")
            return False
