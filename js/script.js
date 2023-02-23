// Objetos para almacenamiento local
const storage = window.localStorage;
const key = "catering";

// Funcion para limpiar el formulario al actualizar la pagina
window.onload = function () {
    inputComensales.value = "";
    selectMenu.value = "";
    selectTemporada.value = "";
    selectMediopago.value = "";
};

// DOM - Elementos HTML
const simuladorForm = document.getElementById("simulador");
const inputComensales = document.getElementById("inputComensales");
const outputComensales = document.getElementById("outputComensales");
const selectMenu = document.getElementById("selectMenu");
const selectTemporada = document.getElementById("selectTemporada");
const selectMediopago = document.getElementById("selectMediopago");
const resultado = document.getElementById("resultado");

// Eventos
inputComensales.addEventListener("input", actualizarOutputComensales);
simuladorForm.addEventListener("submit", calcularCostoCatering);

// JSON - Objetos
const menuObjeto = {
    degustacion: 3500,
    completo: 5000,
    mixto: 7500
};

const temporadaObjeto = {
    primera: 1.5,
    segunda: 1.1,
    tercera: 1.3
};

// Almacenamiento Local
if (storage.getItem(key)) {
    const data = JSON.parse(storage.getItem(key));
    inputComensales.value = data.comensales;
    selectMenu.value = data.menu;
    selectTemporada.value = data.temporada;
    selectMediopago.value = data.mediopago;
    actualizarOutputComensales();
}

// Funciones
function actualizarOutputComensales() {
    outputComensales.value = inputComensales.value;
}

function calcularCostoCatering(event) {
    event.preventDefault();

// Validar cantidad de comensales menor a 10 + animacion para remover el mensaje de alerta
    const cantidadComensales = parseInt(inputComensales.value);
    if (cantidadComensales < 10) {
        let error = resultado.querySelector(".error");
        if (!error) {
            error = document.createElement("p");
            error.classList.add("error");
            resultado.appendChild(error);
        }
        error.textContent = "Para cotizar tu catering debes ingresar un mínimo de 10 comensales.";
        error.classList.remove("destello");
        void error.offsetWidth;
        error.classList.add("destello");
        setTimeout(() => {
            error.remove();
        }, 3000);
        return;
    }


// Almacenar datos
    const datos = {
        comensales: cantidadComensales,
        menu: selectMenu.value,
        temporada: selectTemporada.value,
        mediopago: selectMediopago.value
    };
    storage.setItem(key, JSON.stringify(datos));

// Cálculo del costo
    let costoMenu = menuObjeto[selectMenu.value];
    let factorTemporada = temporadaObjeto[selectTemporada.value];
    let medioPago = selectMediopago.value;
    let costoCatering = cantidadComensales * costoMenu * factorTemporada;

// Aplicar descuento/recargo según medio de pago
    if (medioPago === "efectivo") {
        costoCatering *= 0.95;
    } else if (medioPago === "tarjeta") {
        costoCatering *= 1.08;
    }

// Mostrar resultado
    resultado.textContent = `El costo del catering para ${cantidadComensales} comensales abonando con ${medioPago} será de $${costoCatering.toFixed(2)} `;
}

// Boton para borrar resultado

const borrarResultadoBtn = document.getElementById("borrarResultado");

borrarResultadoBtn.addEventListener("click", borrarResultado);

function borrarResultado() {
    resultado.textContent = "";
    inputComensales.value = "";
    selectMenu.value = "";
    selectTemporada.value = "";
    selectMediopago.value = "";
}

// Boton para ver presupuesto anterior
const verCateringAnteriorBtn = document.getElementById("verCatering");

verCateringAnteriorBtn.addEventListener("click", verCatering);

function verCatering() {
    if (storage.getItem(key)) {
        const data = JSON.parse(storage.getItem(key));
        inputComensales.value = data.comensales;
        selectMenu.value = data.menu;
        selectTemporada.value = data.temporada;
        selectMediopago.value = data.mediopago;
        actualizarOutputComensales();
        calcularCostoCatering(event);
    } else {
        let error = resultado.querySelector(".error");
        if (!error) {
            error = document.createElement("p");
            error.classList.add("error");
            resultado.appendChild(error);
        }
        error.textContent = "No hay un presupuesto anterior guardado";
        error.classList.remove("destello");
        void error.offsetWidth;
        error.classList.add("destello");
        setTimeout(() => {
            error.remove();
        }, 3000);
    }
}
