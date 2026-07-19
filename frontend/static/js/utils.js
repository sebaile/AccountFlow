function formatoMoneda(valor) {

    return Number(valor || 0).toLocaleString("es-CL", {

        style: "currency",

        currency: "CLP"

    });

}

function mostrarMensaje(texto) {

    console.log(texto);

}