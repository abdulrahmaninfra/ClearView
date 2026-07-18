# ClearView Windshield Project Analysis

This document provides a comprehensive analysis of the **ClearView Windshield API** project, detailing its architecture, file structure, database schema, and all exposed API endpoints.

---

## 1. Project Structure

The project is structured as follows:

```
windshield_project/
│
├── main.py                 # FastAPI application entry point & DB initialization
├── requirements.txt        # Python dependency requirements
├── windshield.db           # SQLite database file (auto-generated)
│
└── src/
    ├── api/
    │   ├── route.py        # FastAPI routes / controller endpoints
    │   └── schema.py       # Pydantic models for validation and responses
    │
    └── database/
        ├── __init__.py     # Module initialization
        ├── connect.py      # SQLite connection factory & table creation
        ├── create.py       # DB Create operations (CreateWindshield class)
        ├── read.py         # DB Read operations (GetWindshield class with search/filtering)
        ├── update.py       # DB Update operations (UpdateWindshield helper function)
        └── delete.py       # DB Delete operations (DeleteWindshield class)
```

---

## 2. Dependencies (`requirements.txt`)

The application relies on the following packages:
- **FastAPI**: Modern, fast web framework for building APIs with Python.
- **Uvicorn**: ASGI web server implementation for Python.
- **SQLAlchemy**: (Installed but not actively used; standard library `sqlite3` is used instead).
- **python-dotenv**: Loads environment variables from `.env`.

---

## 3. Database Schema

The database is powered by **SQLite** (`windshield.db`). The table is defined and initialized by `src/database/connect.py` as:

### `windshields` Table

| Column Name  | SQLite Data Type | Constraints               | Description |
|--------------|------------------|---------------------------|-------------|
| `id`         | `INTEGER`        | `PRIMARY KEY AUTOINCREMENT`| Unique identifier |
| `brand`      | `TEXT`           | `NOT NULL`                | Windshield brand name |
| `model`      | `TEXT`           | `NOT NULL`                | Car model target |
| `year`       | `INTEGER`        | `NOT NULL`                | Car model manufacturing year |
| `glass_type` | `TEXT`           | `NOT NULL`                | Material/type of glass (e.g., tempered, laminated) |
| `price`      | `REAL`           | `NOT NULL`                | Product price ($) |
| `stock`      | `INTEGER`        | `NOT NULL`                | Remaining item stock |

---

## 4. API Endpoints

The API is mounted in `main.py` using FastAPI and routes from `src/api/route.py`. All API requests/responses use JSON format.

### Endpoints Summary

| Method | Endpoint | Request Body | Query Parameters | Response Model | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/windshield` | None | `brand`, `model`, `year` *(All optional)* | `List[WindshieldResponse]` | Get windshields (supports dynamic filtering or returns all) |
| **GET** | `/windshield/{windshield_id}` | None | None | `WindshieldResponse` | Get windshield by ID (returns 404 if not found) |
| **POST** | `/windshield` | `WindshieldCreate` | None | `WindshieldResponse` (Status 201) | Create new windshield entry |
| **PUT** | `/windshield/{windshield_id}` | `WindshieldUpdate` | None | `WindshieldResponse` | Update fields of a windshield by ID |
| **DELETE** | `/windshield/{windshield_id}` | None | None | `{ "message": str }` | Delete windshield by ID |

---

## 5. API Models & Request/Response Schemas

Defined in `src/api/schema.py`:

### `WindshieldCreate` (POST Request)
```json
{
  "brand": "Pilkington",
  "model": "Civic",
  "year": 2022,
  "glass_type": "Laminated Acoustic",
  "price": 250.0,
  "stock": 15
}
```
*Constraints:* `price > 0`, `stock >= 0`.

### `WindshieldUpdate` (PUT Request)
All fields are optional (allows partial updates):
```json
{
  "brand": "Pilkington",
  "price": 275.50
}
```
*Constraints:* `price > 0`, `stock >= 0`.

### `WindshieldResponse` (GET / POST / PUT Response)
```json
{
  "id": 1,
  "brand": "Pilkington",
  "model": "Civic",
  "year": 2022,
  "glass_type": "Laminated Acoustic",
  "price": 250.0,
  "stock": 15
}
```

---

## 6. Architecture & Implementation Decisions

1. **Thread-Safe DB Connections**:
   We removed the module-level connection pool in favor of FastAPI's dependency injection (`get_db_connection()`). Every endpoint receives its own isolated SQLite connection context, which is automatically closed when the request concludes.
2. **Robust Exception Handling**:
   Any database errors or unexpected Python runtime exceptions are translated to structured HTTP standard responses (e.g., `404 Not Found` or `500 Internal Server Error`). `HTTPException` triggers are correctly re-raised to prevent swallowing of client validation or routing errors.
3. **Dynamic Filtering**:
   The list route (`GET /windshield`) is highly flexible. Calling `/windshield` without query parameters fetches all records, whereas providing filtering parameters automatically adapts the SQL `WHERE` clause dynamically.
