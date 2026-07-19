class UI {

    // ==========================================
    // TOAST
    // ==========================================

    static toast(mensaje, tipo = "success") {

        const toast = document.createElement("div");

        toast.className = `toast ${tipo}`;

        toast.innerHTML = mensaje;

        document.body.appendChild(toast);

        setTimeout(() => {

            toast.classList.add("show");

        }, 50);

        setTimeout(() => {

            toast.classList.remove("show");

            setTimeout(() => {

                toast.remove();

            }, 300);

        }, 3000);

    }

    // ==========================================
    // MODAL CONFIRMACIÓN
    // ==========================================

    static confirm({ titulo, mensaje, aceptar }) {

        const modal = document.getElementById("modalConfirmacion");

        document.getElementById("tituloConfirmacion").textContent = titulo;

        document.getElementById("mensajeConfirmacion").innerHTML = mensaje;

        modal.classList.add("show");

        const btnAceptar = document.getElementById("btnAceptarConfirmacion");

        const btnCancelar = document.getElementById("btnCancelarConfirmacion");

        btnAceptar.onclick = async () => {

            modal.classList.remove("show");

            await aceptar();

        };

        btnCancelar.onclick = () => {

            modal.classList.remove("show");

        };

    }

}