from .connect import cursor


class GetWindshield:
    def __get_all(self):
        cursor.execute("SELECT * FROM windshields")
        return cursor.fetchall()

    def __get_by_id(self, windshield_id: int):
        cursor.execute("SELECT * FROM windshields WHERE id = ?", (windshield_id,))
        return cursor.fetchone()

    def get_windshield(self, windshield_id: int):
        windshield = self.__get_by_id(windshield_id)
        if windshield:
            print(
                f"ID: {windshield[0]}\n    Brand: {windshield[1]}\n    Model: {windshield[2]}\n    Year: {windshield[3]}\n    Glass Type: {windshield[4]}\n    Price: ${windshield[5]}\n    Stock: {windshield[6]}\n"
            )
            return windshield
        else:
            print(f"No windshield found with ID: {windshield_id}")

    def get_all_windshield(self):
        return self.__get_all()

    def print_all_windshield(self):
        windshields = self.__get_all()
        for windshield in windshields:
            print(
                f"ID: {windshield[0]}\n    Brand: {windshield[1]}\n    Model: {windshield[2]}\n    Year: {windshield[3]}\n    Glass Type: {windshield[4]}\n    Price: ${windshield[5]}\n    Stock: {windshield[6]}\n"
            )
