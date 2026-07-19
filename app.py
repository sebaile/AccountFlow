from flask import Flask, jsonify, request, render_template

from backend.cuentas import (
    listar_cuentas,
    agregar_cuenta,
    actualizar_cuenta,
    eliminar_cuenta
)


app = Flask(
    __name__,
    template_folder="frontend/templates",
    static_folder="frontend/static"
)


# ==========================================
# PÁGINA PRINCIPAL
# ==========================================

@app.route("/")
def index():
    return render_template("index.html")


# ==========================================
# LISTAR CUENTAS
# ==========================================

@app.route("/api/cuentas", methods=["GET"])
def api_listar_cuentas():

    return jsonify(listar_cuentas())


# ==========================================
# CREAR CUENTA
# ==========================================

@app.route("/api/cuentas", methods=["POST"])
def api_crear_cuenta():

    datos = request.get_json()

    agregar_cuenta(datos)

    return jsonify({
        "ok": True,
        "mensaje": "Cuenta creada correctamente"
    })


# ==========================================
# ACTUALIZAR CUENTA
# ==========================================

@app.route("/api/cuentas/<int:indice>", methods=["PUT"])
def api_actualizar_cuenta(indice):

    datos = request.get_json()

    actualizar_cuenta(indice, datos)

    return jsonify({
        "ok": True,
        "mensaje": "Cuenta actualizada correctamente"
    })

# ==========================================
# ELIMINAR CUENTA
# ==========================================

@app.route("/api/cuentas/<int:indice>", methods=["DELETE"])
def api_eliminar_cuenta(indice):

    eliminar_cuenta(indice)

    return jsonify({
        "ok": True,
        "mensaje": "Cuenta eliminada correctamente"
    })


# ==========================================
# INICIAR SERVIDOR
# ==========================================

if __name__ == "__main__":
    app.run(debug=True)