class CuentaManager {

    constructor() {

        // ==========================
        // MODAL
        // ==========================

        this.modal = document.getElementById("modalCuenta");

        this.btnNueva = document.getElementById("btnNuevaCuenta");
        this.btnCerrar = document.getElementById("cerrarModal");
        this.btnCancelar = document.getElementById("cancelarModal");
        this.btnGuardar = document.getElementById("guardarCuenta");

        // ==========================
        // TABLA
        // ==========================

        this.tbody = document.querySelector("#tablaCuentas tbody");

        // ==========================
        // DATOS
        // ==========================

        this.cuentas = [];

        this.editando = false;

        this.idEditar = null;

    }

    // =====================================
    // EVENTOS GENERALES
    // =====================================

    eventos() {

        this.btnNueva.onclick = () => {

            this.editando = false;

            this.idEditar = null;

            this.limpiarFormulario();

            document.getElementById("tituloModal").textContent = "Nueva Cuenta";

            this.btnGuardar.textContent = "Guardar Cuenta";

            this.abrirModal();

        };

        this.btnCerrar.onclick = () => {

            this.cerrarModal();

        };

        this.btnCancelar.onclick = () => {

            this.cerrarModal();

        };

        this.btnGuardar.onclick = () => {

            this.guardar();

        };

    }

    // =====================================
    // MODAL
    // =====================================

    abrirModal() {

        this.modal.classList.add("show");

    }

    cerrarModal() {

        this.modal.classList.remove("show");

        this.editando = false;

        this.idEditar = null;

        this.limpiarFormulario();

        document.getElementById("tituloModal").textContent = "Nueva Cuenta";

        this.btnGuardar.textContent = " Guardar Cuenta";

    }

    // =====================================
    // UTILIDADES
    // =====================================

    formatearFecha(fecha) {

        if (!fecha) return "";

        if (typeof fecha === "string") {

            return fecha.substring(0, 10);

        }

        const d = new Date(fecha);

        if (isNaN(d)) return "";

        return d.toISOString().split("T")[0];

    }

    limpiarFormulario() {

        document.getElementById("servicio").selectedIndex = 0;

        document.getElementById("perfil").value = "";

        document.getElementById("usuario").value = "";

        document.getElementById("password").value = "";

        document.getElementById("cliente").value = "";

        document.getElementById("telefono").value = "";

        document.getElementById("costo").value = "";

        document.getElementById("venta").value = "";

        const instagram = document.getElementById("instagram");

        if (instagram) {

            instagram.value = "";

        }

        const observaciones = document.getElementById("observaciones");

        if (observaciones) {

            observaciones.value = "";

        }

        document.getElementById("inicio").value = "";

        document.getElementById("ciclo").selectedIndex = 0;

        document.getElementById("costo").value = "";

        document.getElementById("venta").value = "";

        document.getElementById("observaciones").value = "";

    }

    // =====================================
    // CRUD
    // =====================================

    async guardar() {

        const datos = {

            servicio: document.getElementById("servicio").value,

            perfil: document.getElementById("perfil").value,

            usuario: document.getElementById("usuario").value,

            password: document.getElementById("password").value,

            cliente: document.getElementById("cliente").value,

            telefono: document.getElementById("telefono").value,

            instagram: document.getElementById("instagram").value,

            inicio: document.getElementById("inicio").value,

            ciclo: document.getElementById("ciclo").value,

            costo: parseFloat(document.getElementById("costo").value) || 0,

            venta: parseFloat(document.getElementById("venta").value) || 0,

            observaciones:
                document.getElementById("observaciones").value

        };

        try {

            let respuesta;

            if (this.editando) {

                respuesta = await API.put(

                    `/api/cuentas/${this.idEditar}`,

                    datos

                );

                UI.toast("✅ Cuenta actualizada correctamente.");

            }

            else {

                respuesta = await API.post(

                    "/api/cuentas",

                    datos

                );

                UI.toast("✅ Cuenta creada correctamente.");

            }

            console.log(respuesta);

            this.cerrarModal();

            await this.cargar();

        }

        catch (error) {

            console.error(error);

            UI.toast("❌ No fue posible guardar la cuenta.");

        }

    }

    async cargar() {

        this.eventos();

        this.cuentas = await API.get("/api/cuentas");

        dashboard.actualizar(this.cuentas);

        this.render();

    }

    render() {

        this.tbody.innerHTML = "";

        this.cuentas.forEach((cuenta, index) => {

            this.tbody.innerHTML += `

                <tr>

                    <td>${this.badgeServicio(cuenta["Servicio"])}</td>

                    <td>${cuenta["Cliente"] ?? ""}</td>

                    <td>$${Number(cuenta["Valor ($)"] ?? 0).toLocaleString("es-CL")}</td>

                    <td>$${Number(cuenta["Ganancia ($)"] ?? 0).toLocaleString("es-CL")}</td>

                    <td>${cuenta["Días Restantes"] ?? ""}</td>

                    <td>${this.badgeEstado(cuenta["Estado"])}</td>

                    <td>

                        <button
                            class="btn-editar"
                            data-id="${index}">
                            ✏️
                        </button>

                        <button
                            class="btn-eliminar"
                            data-id="${index}">
                            🗑️
                        </button>

                    </td>

                </tr>

            `;

        });

        this.eventosEditar();

        this.eventosEliminar();

    }
    badgeEstado(estado) {

        switch (estado) {

            case "Activa":

                return `<span class="badge success">🟢 Activa</span>`;

            case "Por vencer":

                return `<span class="badge warning">🟡 Por vencer</span>`;

            case "Vencida":

                return `<span class="badge danger">🔴 Vencida</span>`;

            default:

                return estado ?? "";

        }

    }
    badgeServicio(servicio) {

        const iconos = {

            "Netflix": "🟥 Netflix",

            "Disney+": "🟦 Disney+",

            "Spotify": "🟩 Spotify",

            "Prime Video": "🟨 Prime",

            "HBO Max": "🟣 Max",

            "Crunchyroll": "🟠 Crunchyroll",

            "YouTube Premium": "🔴 YouTube"

        };

        return iconos[servicio] ?? servicio;

    }
    // =====================================
    // EVENTOS TABLA
    // =====================================

    eventosEditar() {

        document.querySelectorAll(".btn-editar").forEach((boton) => {

            boton.onclick = () => {

                const id = parseInt(boton.dataset.id);

                this.editar(id);

            };

        });

    }

    eventosEliminar() {

        console.log("Registrando eventos eliminar...");

        document.querySelectorAll(".btn-eliminar").forEach((boton) => {

            boton.onclick = () => {

                console.log("Click en eliminar");

                const id = parseInt(boton.dataset.id);

                console.log("ID:", id);

                this.eliminar(id);

            };

        });

    }
    // =====================================
    // EDITAR
    // =====================================

    editar(id) {

        this.editando = true;

        this.idEditar = id;

        const cuenta = this.cuentas[id];

        console.log("Editando:", cuenta);

        document.getElementById("tituloModal").textContent = "Editar Cuenta";

        this.btnGuardar.textContent = " Actualizar Cuenta";

        document.getElementById("servicio").value =
            cuenta["Servicio"] ?? "";

        document.getElementById("perfil").value =
            cuenta["Perfil"] ?? "";

        document.getElementById("usuario").value =
            cuenta["Usuario"] ??
            cuenta["Usuario / Correo"] ??
            "";

        document.getElementById("password").value =
            cuenta["Contraseña"] ?? "";

        document.getElementById("cliente").value =
            cuenta["Cliente"] ?? "";

        document.getElementById("telefono").value =
            cuenta["Teléfono"] ??
            cuenta["Teléfono Cliente"] ??
            "";

        const instagram = document.getElementById("instagram");

        if (instagram) {

            instagram.value =
                cuenta["Usuario Instagram"] ?? "";

        }

        const observaciones = document.getElementById("observaciones");

        if (observaciones) {

            observaciones.value =
                cuenta["Observaciones"] ?? "";

        }

        document.getElementById("inicio").value =
            this.formatearFecha(cuenta["Fecha de Inicio"]);

        document.getElementById("ciclo").value =
            cuenta["Ciclo"] ??
            cuenta["Ciclo de Pago"] ??
            "";
        document.getElementById("costo").value =
            cuenta["Costo ($)"] ?? "";

        document.getElementById("venta").value =
            cuenta["Valor ($)"] ?? "";

        this.abrirModal();

    }

    // =====================================
    // ELIMINAR
    // =====================================

    async eliminar(id) {

        const cuenta = this.cuentas[id];

        UI.confirm({

            titulo: "🗑 Eliminar Cuenta",

            mensaje: `

            <strong>${cuenta["Servicio"]}</strong><br><br>

            Perfil: ${cuenta["Perfil"]}<br>

            Cliente: ${cuenta["Cliente"]}<br><br>

            ¿Deseas eliminar esta cuenta?

        `,

            aceptar: async () => {

                try {

                    await API.delete(

                        `/api/cuentas/${id}`

                    );

                    UI.toast(

                        "🗑 Cuenta eliminada correctamente"

                    );

                    await this.cargar();

                }

                catch {

                    UI.toast(

                        "No fue posible eliminar",

                        "error"

                    );

                }

            }

        });

    }

}

const cuentaManager = new CuentaManager();