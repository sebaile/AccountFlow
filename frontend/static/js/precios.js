let precios = [];

async function cargarPrecios() {

    precios = await API.get("/api/precios");

}