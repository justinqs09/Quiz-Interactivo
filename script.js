const preguntas = [
    {
        pregunta: "¿Cuál es el lenguaje de marcado utilizado para crear páginas web?",
        opciones: ["JavaScript", "HTML", "CSS", "Python"],
        respuesta: "HTML",
        tipo: "seleccion"
    },
    {
        pregunta: "El símbolo '#' se usa para seleccionar un id en CSS.",
        opciones: ["Verdadero", "Falso"],
        respuesta: "Verdadero",
        tipo: "verdadero_falso"
    },
    {
        pregunta: "¿Cuál de estos es un lenguaje de programación?",
        opciones: ["SQL", "HTTP", "CSS", "JavaScript"],
        respuesta: "JavaScript",
        tipo: "seleccion"
    }
];

let preguntaActual = 0;
let puntaje = 0;
let opcionSeleccionada = null;
let respuestasUsuario = [];

// Elementos del DOM
const preguntaTexto = document.getElementById('pregunta-texto');
const opcionesLista = document.getElementById('opciones-lista');
const siguienteBtn = document.getElementById('siguiente-btn');
const puntajeFinal = document.getElementById('puntaje-final');
const totalPreguntas = document.getElementById('total-preguntas');
const resultadosPantalla = document.getElementById('resultados-pantalla');
const preguntasPantalla = document.getElementById('preguntas-pantalla');
const mensajeFinal = document.getElementById('mensaje-final');
const barraProgreso = document.getElementById('barra-progreso');
const detallesErrores = document.getElementById('detalles-errores');

// Mostrar la pregunta actual
function mostrarPregunta() {
    const pregunta = preguntas[preguntaActual];
    preguntaTexto.textContent = pregunta.pregunta;
    opcionesLista.innerHTML = '';
    
    pregunta.opciones.forEach(opcion => {
        const li = document.createElement('li');
        li.textContent = opcion;
        li.classList.add('opcion');
        li.addEventListener('click', () => {
            opcionSeleccionada = opcion;
            verificarRespuesta();
        });
        opcionesLista.appendChild(li);
    });

    actualizarBarraProgreso();
}

function actualizarBarraProgreso() {
    const porcentaje = ((preguntaActual) / preguntas.length) * 100;
    barraProgreso.style.width = `${porcentaje}%`;
}

// Verificar la respuesta seleccionada
function verificarRespuesta() {
    const pregunta = preguntas[preguntaActual];
    const esCorrecto = opcionSeleccionada === pregunta.respuesta;

    respuestasUsuario.push({
        pregunta: pregunta.pregunta,
        seleccionada: opcionSeleccionada,
        correcta: pregunta.respuesta,
        esCorrecto: esCorrecto
    });

    if (esCorrecto) {
        puntaje++;
    }

    preguntaActual++;
    if (preguntaActual < preguntas.length) {
        mostrarPregunta();
    } else {
        mostrarResultados();
    }
}

// Mostrar los resultados
function mostrarResultados() {
    preguntasPantalla.classList.add('ocultar');
    resultadosPantalla.classList.remove('ocultar');
    puntajeFinal.textContent = puntaje;
    totalPreguntas.textContent = preguntas.length;

    const porcentaje = (puntaje / preguntas.length) * 100;
    if (porcentaje === 100) {
        mensajeFinal.textContent = "¡Excelente! Respondiste todas las preguntas correctamente.";
    } else if (porcentaje >= 70) {
        mensajeFinal.textContent = "¡Muy bien! Tienes un buen conocimiento.";
    } else if (porcentaje >= 40) {
        mensajeFinal.textContent = "Está bien, pero puedes mejorar.";
    } else {
        mensajeFinal.textContent = "Necesitas estudiar más. ¡Inténtalo de nuevo!";
    }

    // Mostrar respuestas incorrectas
    const detalles = respuestasUsuario.filter(res => !res.esCorrecto);
    if (detalles.length > 0) {
        detalles.forEach(det => {
            detallesErrores.innerHTML += `
                <p><strong>Pregunta:</strong> ${det.pregunta}</p>
                <p><strong>Tu respuesta:</strong> ${det.seleccionada}</p>
                <p><strong>Respuesta correcta:</strong> ${det.correcta}</p>
            `;
        });
    }

    // Guardar puntaje en localStorage
    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    historial.push({
        fecha: new Date().toLocaleString(),
        puntaje: puntaje,
        total: preguntas.length
    });
    localStorage.setItem('historial', JSON.stringify(historial));
}

siguienteBtn.addEventListener('click', () => {
    if (opcionSeleccionada) {
        verificarRespuesta();
    }
});

// Iniciar el quiz
mostrarPregunta();
