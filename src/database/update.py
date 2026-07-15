import sqlite3

from .connect import conn, cursor


def UpdateWindshield(
    windshield_id: int,
    brand: str = None,
    model: str = None,
    year: int = None,
    glass_type: str = None,
    price: float = None,
    stock: int = None,
):
    update_fields = []
    params = []

    if brand:
        update_fields.append("brand= ?")
        params.append(brand)
    if model:
        update_fields.append("model= ?")
        params.append(model)
    if year:
        update_fields.append("year= ?")
        params.append(year)
    if glass_type:
        update_fields.append("glass_type= ?")
        params.append(glass_type)
    if price:
        update_fields.append("price= ?")
        params.append(price)
    if stock is not None:
        update_fields.append("stock= ?")
        params.append(stock)

    if not update_fields:
        return

    query = f"UPDATE windshields SET {','.join(update_fields)} WHERE id = ?"
    params.append(windshield_id)

    try:
        cursor.execute(query, params)
        conn.commit()
    except sqlite3.Error as e:
        print(f"Error updating windshield: {e}")
