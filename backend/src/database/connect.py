from sqlcipher3 import dbapi2 as sqlite3

from ..core.config import Settings

settings = Settings()


def create_db():
    conn = sqlite3.connect(settings.DATABASE_NAME)
    cursor = conn.cursor()

    cursor.execute(f"PRAGMA key='{settings.DATABASE_PASSWORD}';")

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS windshields (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            brand TEXT NOT NULL,
            model TEXT NOT NULL,
            year INTEGER NOT NULL,
            glass_type TEXT NOT NULL,
            price REAL NOT NULL,
            stock INTEGER NOT NULL
        )
    """)
    conn.commit()
    conn.close()


def get_db_connection():
    conn = sqlite3.connect(settings.DATABASE_NAME)

    # Set the encryption key immediately
    conn.execute(f"PRAGMA key='{settings.DATABASE_PASSWORD}';")

    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()
