# ClearView

A **FastAPI**-based windshield inventory management system with encrypted SQLite storage (SQLCipher), full CRUD operations, dynamic filtering, and thread-safe database connections.

---

## Project Structure

```
.
├── README.md
├── PROJECT_ANALYSIS.md
├── requirements.txt
└── backend/
    ├── .env.example               # Environment variable template
    ├── main.py                    # FastAPI app entry point
    └── src/
        ├── api/
        │   ├── route.py           # API routes (CRUD endpoints)
        │   └── schema.py          # Pydantic request/response models
        ├── core/
        │   └── config.py          # Application settings (pydantic-settings)
        └── database/
            ├── __init__.py
            ├── connect.py         # SQLCipher connection factory & table creation
            ├── create.py          # CreateWindshield class
            ├── read.py            # GetWindshield class (search/filter/get-all)
            ├── update.py          # UpdateWindshield helper function
            └── delete.py          # DeleteWindshield class
```

---

## Dependencies

| Package            | Purpose                        |
|--------------------|---------------------------------|
| **FastAPI**        | Web framework                  |
| **Uvicorn**        | ASGI server                    |
| **Pydantic**       | Data validation & serialization |
| **pydantic-settings** | Settings management via `.env` |
| **sqlcipher3**     | Encrypted SQLite database       |
| **python-dotenv**  | Load environment variables      |

---

## Setup

```bash
# 1. Copy environment template
cp backend/.env.example backend/.env

# 2. Edit backend/.env with your credentials
#    DATABASE_PASSWORD is required — this encrypts the SQLite database

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run from the backend directory
cd backend

# Option A — via uvicorn directly
uvicorn main:app --reload

# Option B — via python (uses uvicorn under the hood)
python main.py
```

The API documentation is auto-generated at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## Environment Variables (`.env`)

| Variable           | Default         | Description               |
|--------------------|-----------------|---------------------------|
| `DATABASE_NAME`    | `database.db`   | SQLite database filename  |
| `DATABASE_PASSWORD`| *(required)*    | Encryption passphrase     |
| `HOST`             | `127.0.0.1`     | Server bind address       |
| `PORT`             | `8000`          | Server port               |

---

## Database Schema

### Table: `windshields`

Encrypted via **SQLCipher** (256-bit AES).

| Column      | Type    | Constraints               |
|-------------|---------|---------------------------|
| `id`        | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `brand`     | TEXT    | NOT NULL                  |
| `model`     | TEXT    | NOT NULL                  |
| `year`      | INTEGER | NOT NULL                  |
| `glass_type`| TEXT    | NOT NULL                  |
| `price`     | REAL    | NOT NULL                  |
| `stock`     | INTEGER | NOT NULL                  |

---

## API Endpoints

| Method | Endpoint                    | Description                                      |
|--------|-----------------------------|--------------------------------------------------|
| GET    | `/windshield`               | List windshields (optional filters: `brand`, `model`, `year`) |
| GET    | `/windshield/{id}`          | Get single windshield by ID                      |
| POST   | `/windshield`               | Create a new windshield entry (status 201)       |
| PUT    | `/windshield/{id}`          | Partially update a windshield                    |
| DELETE | `/windshield/{id}`          | Delete a windshield                              |

### Request Schemas

**POST /windshield**
```json
{
  "brand": "Pilkington",
  "model": "Chiron",
  "year": 2022,
  "glass_type": "Ballistic Armor",
  "price": 250.0,
  "stock": 15
}
```
*Constraints: `price > 0`, `stock >= 0`*

**PUT /windshield/{id}** — all fields optional (same constraints apply if provided).

### Response Schema

All data endpoints return:
```json
{
  "id": 1,
  "brand": "Pilkington",
  "model": "Chiron",
  "year": 2022,
  "glass_type": "Ballistic Armor",
  "price": 250.0,
  "stock": 15
}
```

---

## Architecture & Design Decisions

- **Encrypted at rest** — Database is encrypted via SQLCipher with a passphrase from `.env`.
- **Thread-safe connections** — Each request gets an isolated connection via FastAPI dependency injection (`get_db_connection()`), automatically closed after the request.
- **Exception handling** — Database and runtime errors are mapped to structured HTTP responses (`404`, `500`). `HTTPException`s are re-raised (not swallowed).
- **Dynamic filtering** — `GET /windshield` builds the `WHERE` clause adaptively from query parameters; omit all params to fetch every record.
- **CORS & GZip** — CORS middleware configured via settings; GZip compression enabled for responses > 1 KB.
