const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const inventarioDeLaMascota = document.getElementById('inventarioMascota')


// Asisnar Nombre //
const form = document.createElement('form');
form.style.position = "fixed";
form.setAttribute('id', 'formularioMascota');
form.style.top = "0";
form.style.left = "0";
form.style.width = "100%";
form.style.height = "100%";
form.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
document.body.appendChild(form);

// Agregar campo de nombre al formulario
const inputName = document.createElement('input');
inputName.setAttribute('type', 'text');
inputName.setAttribute('id', 'asignarNombre');
inputName.setAttribute('placeholder', 'Nombre...');
inputName.name = 'asignarNombre';
inputName.setAttribute('value', "");
inputName.setAttribute('required',true);
form.appendChild(inputName);

// Agregar botón para quitar el formulario al formulario
const buttonRemove = document.createElement('input');
buttonRemove.setAttribute('type', 'button');
buttonRemove.setAttribute('value', 'Nombrar Mascota');
buttonRemove.setAttribute('id', 'botonAsignarNombre');
buttonRemove.setAttribute('name', 'asignarNombre');
buttonRemove.addEventListener('click', function() {
    form.remove();
    setInterval(agregarMoneda,1000);
    setInterval(bucleJuego, 1000);
});
form.appendChild(buttonRemove);

inputName.addEventListener('input', function(e){
    let pedirNombre = inputName.value;
    pedirNombre = pedirNombre[0].toLocaleUpperCase() + pedirNombre.slice(1);
    inputName.value = pedirNombre; 

    ctx.fillStyle = "white";
    ctx.font = `24px Arial`;
    ctx.clearRect(0, 0, 200, 200)
    ctx.fillText(
    pedirNombre,
    60,
    30,
    );
})

let monedas = 0;
function agregarMoneda(){
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.clearRect(500, 0, 200, 200);
    ctx.fillText(
    monedas,
    540,
    25,
    );

    monedas++;
}

//----------- Insertar personaje y animacion dentro del Canvas-------------//
const imagenFoxyUrl = 'img/Foxy2.png';
const jsonFoxy = 'img/Foxy2.json';

const imagenFoxy = new Image();
imagenFoxy.src = imagenFoxyUrl;

let intervaloHambre;
let intervaloDiversion;
let intervaloSuenno;

fetch(jsonFoxy)
    .then(response => response.json())
    .then(json => {

        let frameActual = 0;
        const frames = json.frames;

        let tiempoDuracion = 0;
        let duracionDelFrame = frames[frameActual].duration;

        function renderizado(tiempoTranscurrido){
            tiempoDuracion += tiempoTranscurrido;

            // Dibujamos el cuadro actual de la animación
            const frame = frames[frameActual];
            const frameData = frame.frame;

            
            ctx.drawImage(
                imagenFoxy,
                frameData.x + 1,
                frameData.y,
                frameData.w,
                frameData.h,
                300,
                220,
                frameData.w + 60,
                frameData.h + 60
            );
            if(tiempoDuracion > duracionDelFrame){
                frameActual = (frameActual + 1) % frames.length;
                duracionDelFrame = frames[frameActual].duration;
                tiempoDuracion = 0;
            }

        }

        let tiempoAnterior = 0;
        function bucleJuego(tiempoActual){
            const tiempoTranscurrido = tiempoActual - tiempoAnterior;
            tiempoAnterior = tiempoActual;

            renderizado(tiempoTranscurrido);

            requestAnimationFrame(bucleJuego);
        }
        requestAnimationFrame(bucleJuego);
    });

//---------- Logica del Juego---------------//

const barraHambre = document.getElementById('barraHambre');
const barraSuenno = document.getElementById('barraSuenno');
const barraDiversion = document.getElementById('barraAburrimiento');

let Personaje = {
    barraHambre,
    barraDiversion,
    barraSuenno,
}

function alimentar(){
    Personaje.barraHambre.value += 30;
    Personaje.barraDiversion.value -= 1;
    Personaje.barraSuenno.value -= 2;
    if(Personaje.barraHambre.value < 0){
        morir();
    }
}

function dormir(){
    Personaje.barraSuenno.value = Personaje.barraSuenno.max;
    Personaje.barraHambre.value -= 20;
    Personaje.barraDiversion.value -= 30;
    if(Personaje.barraSuenno.value < 0){
        morir();
    }
}


function jugar(){
    Personaje.barraDiversion.value += 30;
    Personaje.barraSuenno.value -= 8;
    if(Personaje.barraDiversion.value < 0){
        morir();
    }

}

const tengoHambreURL = 'img/Hambre.png';
const tengoHambre = new Image();
tengoHambre.src = tengoHambreURL;

const estoyAburridoURL = 'img/Aburrido.png';
const estoyAburrido = new Image();
estoyAburrido.src = estoyAburridoURL;

const TengoSuennoURL = 'img/Suenno.png';
const TengoSuenno = new Image();
TengoSuenno.src = TengoSuennoURL;

function bucleJuego(){
    Personaje.barraHambre.value -= 1;
    Personaje.barraDiversion.value -= 2;
    Personaje.barraSuenno.value -= 0.5;



    if(Personaje.barraHambre.value <= 10){
        ctx.drawImage(
            tengoHambre,
            200,
            5,
        )
    }else if(Personaje.barraHambre.value > 20){
        ctx.clearRect(200, 5, 100, 100);
    }
    
    if(Personaje.barraDiversion.value <= 10){
        ctx.drawImage(
            estoyAburrido,
            260,
            2,
        )
    }else if(Personaje.barraDiversion.value > 20){
        ctx.clearRect(260, 2, 100, 100);
    }
    
    if(Personaje.barraSuenno.value <= 20){
        ctx.drawImage(
            TengoSuenno,
            300,
            2,
        )
    }else if(Personaje.barraSuenno.value > 20){
        ctx.clearRect(300, 2, 100, 100);
    }

    morir();
}

function morir(){
    if(Personaje.barraHambre.value == 0 || Personaje.barraDiversion.value == 0 || Personaje.barraSuenno.value == 0){

        const fondoNecesidades = document.createElement("div");
        fondoNecesidades.style.position = "fixed";
        fondoNecesidades.style.top = "0";
        fondoNecesidades.style.left = "0";
        fondoNecesidades.style.width = "100%";
        fondoNecesidades.style.height = "100%";
        fondoNecesidades.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        document.body.appendChild(fondoNecesidades);

        const fondoNecesidades2 = document.createElement("div");
        fondoNecesidades2.style.position = "fixed";
        fondoNecesidades2.style.top = "50%";
        fondoNecesidades2.style.left = "50%";
        fondoNecesidades2.style.transform = "translate(-50%, -50%)";
        fondoNecesidades2.style.width = "400px";
        fondoNecesidades2.style.height = "320px";
        fondoNecesidades2.style.backgroundImage = "url(img/fondoOkk.png)";
        fondoNecesidades2.style.backgroundSize = "cover";
        fondoNecesidades2.style.border = "2px solid #000";
        fondoNecesidades2.style.borderRadius = "2px";
        fondoNecesidades2.style.padding = "20px";
        fondoNecesidades.appendChild(fondoNecesidades2);

        const mensajeNecesidad = document.createElement("h1");
        mensajeNecesidad.textContent = "Tu mascota ha Muerto!";
        mensajeNecesidad.style.margin = "50px auto";
        mensajeNecesidad.style.textAlign = "center";
        mensajeNecesidad.style.color = "#000";
        fondoNecesidades2.appendChild(mensajeNecesidad);

        const mensajeNecesidad2 = document.createElement("p");
        mensajeNecesidad2.textContent = "Haz perdido a tu mascota una pena... \n\n Mejor suerte para la proxima!";
        mensajeNecesidad2.style.margin = "15px auto";
        mensajeNecesidad2.style.textAlign = "center";
        mensajeNecesidad2.style.color = "#000";
        fondoNecesidades2.appendChild(mensajeNecesidad2);

        const mensajeNecesidad3 = document.createElement("p");
        mensajeNecesidad3.textContent = "\n\nMuchas gracias por probar :)";
        mensajeNecesidad3.style.margin = "15px auto";
        mensajeNecesidad3.style.textAlign = "center";
        mensajeNecesidad3.style.color = "#000";
        fondoNecesidades2.appendChild(mensajeNecesidad3);

        monedas = 0;
        clearInterval(agregarMoneda)
    }
}

