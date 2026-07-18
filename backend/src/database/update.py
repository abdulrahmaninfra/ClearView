from sqlcipher3 import dbapi2 as sqlite3


def UpdateWindshield(
    windshield_id: int,
    conn: sqlite3.Connection,
    brand: str = None,
    model: str = None,
    year: int = None,
    glass_type: str = None,
    price: float = None,
    stock: int = None,
):
    update_fields = []
    params = []

    if brand is not None:
        update_fields.append("brand = ?")
        params.append(brand)
    if model is not None:
        update_fields.append("model = ?")
        params.append(model)
    if year is not None:
        update_fields.append("year = ?")
        params.append(year)
    if glass_type is not None:
        update_fields.append("glass_type = ?")
        params.append(glass_type)
    if price is not None:
        update_fields.append("price = ?")
        params.append(price)
    if stock is not None:
        update_fields.append("stock = ?")
        params.append(stock)

    if not update_fields:
        return

    query = f"UPDATE windshields SET {', '.join(update_fields)} WHERE id = ?"
    params.append(windshield_id)

    cursor = conn.cursor()
    cursor.execute(query, params)
    conn.commit()
