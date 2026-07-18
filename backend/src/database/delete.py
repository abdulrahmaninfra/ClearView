import sqlite3


class DeleteWindshield:
    def __init__(self, windshield_id: int, conn: sqlite3.Connection):
        self.windshield_id = windshield_id
        self.conn = conn

    def delete(self):
        cursor = self.conn.cursor()
        cursor.execute(
            "DELETE FROM windshields WHERE id = ?", (self.windshield_id,)
        )
        self.conn.commit()
