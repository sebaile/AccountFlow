class Dashboard {

    actualizar(cuentas) {

        // ==========================
        // TOTAL CUENTAS
        // ==========================

        document.getElementById("totalCuentas").textContent =
            cuentas.length;

        // ==========================
        // CLIENTES ÚNICOS
        // ==========================

        const clientes = new Set();

        cuentas.forEach(cuenta => {

            const nombre = (cuenta["Cliente"] ?? "").trim();

            if (nombre !== "") {

                clientes.add(nombre);

            }

        });

        document.getElementById("totalClientes").textContent =
            clientes.size;

        // ==========================
        // GANANCIAS
        // ==========================

        let ganancias = 0;

        cuentas.forEach(cuenta => {

            let valor = cuenta["Ganancia ($)"] ?? 0;

            valor = valor
                .toString()
                .replace("$", "")
                .replace(/\./g, "")
                .replace(",", ".")
                .trim();

            valor = parseFloat(valor);

            if (!isNaN(valor)) {

                ganancias += valor;

            }

        });

        document.getElementById("ganancias").textContent =
            "$" + ganancias.toLocaleString("es-CL");
        // ==========================
        // CUENTAS POR VENCER
        // ==========================

        let porVencer = 0;

        const hoy = new Date();

        cuentas.forEach(cuenta => {

            if (!cuenta["Fecha de Vencimiento"]) return;

            const fecha = new Date(cuenta["Fecha de Vencimiento"]);

            const dias = Math.ceil(

                (fecha - hoy) / (1000 * 60 * 60 * 24)

            );

            if (dias >= 0 && dias <= 3) {

                porVencer++;

            }

        });

        document.getElementById("porVencer").textContent =
            porVencer;

    }

}

const dashboard = new Dashboard();