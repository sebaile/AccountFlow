from datetime import datetime, timedelta

from .excel import obtener_hoja, guardar_excel


# ==========================================
# UTILIDADES
# ==========================================

def convertir_valor(valor):

    if isinstance(valor, datetime):
        return valor.strftime("%Y-%m-%d")

    return valor


def calcular_datos(inicio, ciclo, costo, venta):

    """
    Calcula automáticamente todos los datos
    derivados de la cuenta.
    """

    # --------------------------
    # Fecha Inicio
    # --------------------------

    if isinstance(inicio, str):

        inicio = datetime.strptime(inicio, "%Y-%m-%d")

    # --------------------------
    # Duración
    # --------------------------

    if ciclo == "Mensual":

        duracion = 31

    elif ciclo == "Anual":

        duracion = 365

    else:

        duracion = 30

    # --------------------------
    # Fechas
    # --------------------------

    fecha_vencimiento = inicio + timedelta(days=duracion)

    proximo_pago = fecha_vencimiento

    # --------------------------
    # Ganancia
    # --------------------------

    costo = float(costo)

    venta = float(venta)

    ganancia = venta - costo

    # --------------------------
    # Días restantes
    # --------------------------

    hoy = datetime.now()

    dias_restantes = (fecha_vencimiento.date() - hoy.date()).days

    # --------------------------
    # Estado
    # --------------------------

    if dias_restantes < 0:

        estado = "Vencida"

    elif dias_restantes <= 3:

        estado = "Por vencer"

    else:

        estado = "Activa"

    # --------------------------
    # Recordatorio
    # --------------------------

    if dias_restantes <= 3:

        recordatorio = "Enviar recordatorio"

    else:

        recordatorio = ""

    return {

        "fecha_vencimiento": fecha_vencimiento,

        "duracion": duracion,

        "ganancia": ganancia,

        "dias_restantes": dias_restantes,

        "proximo_pago": proximo_pago,

        "estado": estado,

        "recordatorio": recordatorio

    }


# ==========================================
# LISTAR CUENTAS
# ==========================================

def listar_cuentas():

    wb, ws = obtener_hoja("Cuentas", data_only=True)

    encabezados = [

        str(celda.value).strip() if celda.value

        else f"COL_{i+1}"

        for i, celda in enumerate(ws[1])

    ]

    cuentas = []

    for fila in ws.iter_rows(min_row=2):

        servicio = fila[0].value

        perfil = fila[1].value

        usuario = fila[2].value

        cliente = fila[4].value

        if not any([

            servicio,

            perfil,

            usuario,

            cliente

        ]):

            continue

        cuenta = {}

        for i, celda in enumerate(fila):

            if i >= len(encabezados):

                break

            cuenta[encabezados[i]] = convertir_valor(

                celda.value

            )

        cuentas.append(cuenta)

    wb.close()

    return cuentas


# ==========================================
# AGREGAR CUENTA
# ==========================================

def agregar_cuenta(datos):

    wb, ws = obtener_hoja("Cuentas")

    fila_libre = None

    for fila in range(2, 302):

        if ws.cell(fila, 1).value is None:

            fila_libre = fila

            break

    if fila_libre is None:

        fila_libre = ws.max_row + 1

    # --------------------------
    # Datos recibidos
    # --------------------------

    inicio = datos.get("inicio")

    ciclo = datos.get("ciclo")

    costo = datos.get("costo", 0)

    venta = datos.get("venta", 0)

    calculos = calcular_datos(

        inicio,

        ciclo,

        costo,

        venta

    )

    # --------------------------
    # Datos ingresados
    # --------------------------

    ws.cell(fila_libre, 1).value = datos.get("servicio")
    ws.cell(fila_libre, 2).value = datos.get("perfil")
    ws.cell(fila_libre, 3).value = datos.get("usuario")
    ws.cell(fila_libre, 4).value = datos.get("password")
    ws.cell(fila_libre, 5).value = datos.get("cliente")
    ws.cell(fila_libre, 6).value = datos.get("telefono")
    ws.cell(fila_libre, 7).value = datos.get("instagram")

    ws.cell(fila_libre, 8).value = inicio

    ws.cell(fila_libre, 9).value = calculos["fecha_vencimiento"]

    ws.cell(fila_libre, 10).value = ciclo

    ws.cell(fila_libre, 11).value = costo

    ws.cell(fila_libre, 12).value = venta

    ws.cell(fila_libre, 13).value = calculos["ganancia"]

    ws.cell(fila_libre, 14).value = calculos["duracion"]

    ws.cell(fila_libre, 15).value = calculos["dias_restantes"]

    ws.cell(fila_libre, 16).value = calculos["proximo_pago"]

    ws.cell(fila_libre, 17).value = calculos["estado"]

    ws.cell(fila_libre, 18).value = ""

    ws.cell(fila_libre, 19).value = calculos["recordatorio"]

    ws.cell(fila_libre, 20).value = datos.get("observaciones", "")

    guardar_excel(wb)

    wb.close()

    return True


# ==========================================
# ACTUALIZAR CUENTA
# ==========================================

def actualizar_cuenta(indice, datos):

    wb, ws = obtener_hoja("Cuentas")

    fila = indice + 2

    inicio = datos.get("inicio")

    ciclo = datos.get("ciclo")

    costo = datos.get("costo", 0)

    venta = datos.get("venta", 0)

    calculos = calcular_datos(

        inicio,

        ciclo,

        costo,

        venta

    )

    ws.cell(fila, 1).value = datos.get("servicio")
    ws.cell(fila, 2).value = datos.get("perfil")
    ws.cell(fila, 3).value = datos.get("usuario")
    ws.cell(fila, 4).value = datos.get("password")
    ws.cell(fila, 5).value = datos.get("cliente")
    ws.cell(fila, 6).value = datos.get("telefono")
    ws.cell(fila, 7).value = datos.get("instagram")

    ws.cell(fila, 8).value = inicio

    ws.cell(fila, 9).value = calculos["fecha_vencimiento"]

    ws.cell(fila, 10).value = ciclo

    ws.cell(fila, 11).value = costo

    ws.cell(fila, 12).value = venta

    ws.cell(fila, 13).value = calculos["ganancia"]

    ws.cell(fila, 14).value = calculos["duracion"]

    ws.cell(fila, 15).value = calculos["dias_restantes"]

    ws.cell(fila, 16).value = calculos["proximo_pago"]

    ws.cell(fila, 17).value = calculos["estado"]

    ws.cell(fila, 18).value = ""

    ws.cell(fila, 19).value = calculos["recordatorio"]

    ws.cell(fila, 20).value = datos.get("observaciones", "")

    guardar_excel(wb)

    wb.close()

    return True


# ==========================================
# ELIMINAR CUENTA
# ==========================================

def eliminar_cuenta(indice):

    wb, ws = obtener_hoja("Cuentas")

    fila = indice + 2

    # Limpiar columnas A-T
    for columna in range(1, 21):

        ws.cell(fila, columna).value = None

    guardar_excel(wb)

    wb.close()

    return True