import os
import openpyxl

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

EXCEL_PATH = os.path.join(
    BASE_DIR,
    "database",
    "Cuentas Streaming.xlsx"
)


def abrir_excel(data_only=False):
    return openpyxl.load_workbook(
        EXCEL_PATH,
        data_only=data_only
    )


def guardar_excel(workbook):
    workbook.save(EXCEL_PATH)


def obtener_hoja(nombre, data_only=False):

    wb = abrir_excel(data_only)

    return wb, wb[nombre]