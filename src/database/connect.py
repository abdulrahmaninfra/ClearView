import sqlite3

conn = sqlite3.connect("windshield.db")
cursor = conn.cursor()


def create_db():
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


def get_db_connection():
    conn = sqlite3.connect("windshield.db")
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()
