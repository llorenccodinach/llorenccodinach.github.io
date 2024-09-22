const restdarkModeStylesheet = document.getElementById("dark-mode-rest-stylesheet")
const restdarkModeToggle = document.getElementById('darkModeToggle');

const selectorFecha = document.getElementById('selectorFecha');
const inputFecha = document.getElementById('fecha');
const selectorPersonas = document.getElementById('selectorPersonas');
const inputPersonas = document.getElementById('personas');
const selectorHora = document.getElementById('selectorHora');
const inputHora = document.getElementById('hora');
const selectorMesa = document.getElementById('selectorMesa');
const inputMesa = document.getElementById('mesa');

let reservas = {}

if (localStorage.getItem('dark-mode') === 'enabled') {
    restdarkModeStylesheet.removeAttribute('disabled');
    restdarkModeToggle.checked = true;
}

restdarkModeToggle.addEventListener('click', () => {
    applyTransition()
    if (restdarkModeStylesheet.disabled) {
        restdarkModeStylesheet.removeAttribute('disabled');
    } else {
        restdarkModeStylesheet.setAttribute('disabled', 'true');
    }
});

function encontrarElementoConEstiloEspecifico() {
    const todosLosElementos = document.querySelectorAll('*');

    for (let elemento of todosLosElementos) {
        if(elemento.title == "For evaluation use only."){
            elemento.remove()
        }
    }
}

const svg = document.getElementById('svg');
const zoomInButton = document.getElementById('zoomIn');
const zoomOutButton = document.getElementById('zoomOut');

let viewBox = svg.getAttribute('viewBox').split(' ').map(Number); 
function zoom(inOut, zoomFactor) {
    viewBox = svg.getAttribute('viewBox').split(' ').map(Number);
    const widthChange = viewBox[2] * zoomFactor;
    const heightChange = viewBox[3] * zoomFactor;
  
    if (inOut === 'in') {
      viewBox[2] -= widthChange;
      viewBox[3] -= heightChange;
      viewBox[0] += widthChange / 2;
      viewBox[1] += heightChange / 2;
    } else if (inOut === 'out') {
      viewBox[2] += widthChange;
      viewBox[3] += heightChange;
      viewBox[0] -= widthChange / 2;
      viewBox[1] -= heightChange / 2;
    }
  
    svg.setAttribute('viewBox', viewBox.join(' '));
  
    // Remover la transición después de que se complete
    /*
    setTimeout(() => {
      svg.style.transition = 'none';
    }, 300); // El tiempo debe coincidir con la duración de la transición en CSS
    */
  
}

// Asociar las funciones de zoom a los botones
zoomInButton.addEventListener('click', () => zoom('in',0.1));
zoomOutButton.addEventListener('click', () => zoom('out',0.1));

// Variables para el arrastre
let isDragging = false;
let startX, startY, viewBoxX, viewBoxY;

// Función para iniciar el arrastre
function startDrag(evt) {
    viewBox = svg.getAttribute('viewBox').split(' ').map(Number);
  isDragging = true;
  const clientX = evt.type === 'touchstart' ? evt.touches[0].clientX : evt.clientX;
  const clientY = evt.type === 'touchstart' ? evt.touches[0].clientY : evt.clientY;

  startX = clientX;
  startY = clientY;

  viewBoxX = parseFloat(viewBox[0]);
  viewBoxY = parseFloat(viewBox[1]);

  evt.preventDefault();
}

// Función para manejar el movimiento del arrastre
function drag(evt) {
    
    if (isDragging) {
        viewBox = svg.getAttribute('viewBox').split(' ').map(Number);
        const clientX = evt.type === 'touchmove' ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.type === 'touchmove' ? evt.touches[0].clientY : evt.clientY;

    // Calcular la diferencia en la posición del cursor
    const dx = startX - clientX;
    const dy = startY - clientY;

    // Calcular la proporción entre el tamaño del viewBox y las dimensiones del SVG
    const scaleX = viewBox[2] / svg.clientWidth;
    const scaleY = viewBox[3] / svg.clientHeight;

    // Aplicar la proporción al desplazamiento
    svg.setAttribute('viewBox', `${viewBoxX + dx * scaleX} ${viewBoxY + dy * scaleY} ${viewBox[2]} ${viewBox[3]}`);
    }
  }

// Función para finalizar el arrastre
function endDrag() {
  isDragging = false;
}

// Asociar eventos para el arrastre
svg.addEventListener('mousedown', startDrag);
svg.addEventListener('mousemove', drag);
svg.addEventListener('mouseup', endDrag);
svg.addEventListener('mouseleave', endDrag);

// Para dispositivos táctiles
svg.addEventListener('touchstart', startDrag);
svg.addEventListener('touchmove', drag);
svg.addEventListener('touchend', endDrag);
svg.addEventListener('touch', endDrag)

let isHovering = false;

const divMaps = document.querySelectorAll(".rest-map-bottom")

divMaps.forEach(element => {
    element.addEventListener('mouseenter', function() {
        isHovering = true;
    });
    element.addEventListener('mouseleave', function() {
        isHovering = false;
    });
});

document.addEventListener('wheel', function(event) {
    if(isHovering){if (event.deltaY < 0) {
        zoom('in',0.1);
    } else if (event.deltaY > 0) {
        zoom('out',0.1)
    }}
});

const mesas = svg.querySelectorAll(".rest-mesa");

console.log(mesas)

mesas.forEach(element => {
    element.addEventListener("pointerdown", () => {
        const cardMesas = document.querySelectorAll(".rest-emp-right-card");
        if(element.classList.contains("rest-mesa-selected") || element.style.fill == "rgba(128, 0, 0, 0.21)"){
            element.classList.remove("rest-mesa-selected")
            for (let i = 0; i < cardMesas.length; i++) {
                cardMesas[i].classList.remove("rest-emp-right-card-selected")
            }
        }else{
            mesas.forEach(elementP => {
                elementP.classList.remove("rest-mesa-selected")
            })
            element.classList.add("rest-mesa-selected")
            inputMesa.value = element.parentElement.getAttribute("xlink:title")
            for (let i = 0; i < cardMesas.length; i++) {
                if(element.parentElement.getAttribute("xlink:title") == cardMesas[i].getAttribute("id")){
                    cardMesas[i].classList.add("rest-emp-right-card-selected")
                    cardMesas[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }else{
                    cardMesas[i].classList.remove("rest-emp-right-card-selected")
                }
            }
        }
        document.getElementById("rest-confirm-mesa").innerHTML = `
    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="black" stroke="none" xmlns="http://www.w3.org/2000/svg">
        <path class="mesa-confirm" fill-rule="evenodd" clip-rule="evenodd" d="M1.73306 1.03631C2.08026 0.94014 2.45235 1.03817 2.7071 1.29292L22.7071 21.2929C23.0976 21.6834 23.0976 22.3166 22.7071 22.7071C22.3166 23.0977 21.6834 23.0977 21.2929 22.7071L14 15.4142L12.9142 16.5C12.1341 17.2802 10.8684 17.2827 10.0865 16.5007L3.29296 9.70718C1.58311 7.99734 1.01881 6.00221 0.879106 4.46556C0.809325 3.698 0.844063 3.03552 0.896734 2.56147C0.926579 2.29285 0.964429 2.02212 1.02938 1.75935C1.11559 1.41264 1.38869 1.13169 1.73306 1.03631ZM2.87096 4.2852C2.98137 5.49843 3.41721 7.00301 4.70713 8.29291L11.5 15.0858L12.5858 14L2.87096 4.2852Z" fill="none" stroke="none"></path> <path class="mesa-confirm" d="M18.2071 1.79292C18.5976 2.18344 18.5976 2.81661 18.2071 3.20713L15.3113 6.10295C14.955 6.45919 14.9505 6.97388 15.1985 7.38727L18.7929 3.79292C19.1834 3.40239 19.8166 3.40239 20.2071 3.79292C20.5976 4.18344 20.5976 4.81661 20.2071 5.20713L16.6128 8.80148C17.0261 9.04952 17.5408 9.04498 17.8971 8.68873L20.7929 5.79292C21.1834 5.40239 21.8166 5.40239 22.2071 5.79292C22.5976 6.18344 22.5976 6.81661 22.2071 7.20713L19.3113 10.1029C18.3379 11.0764 16.8269 11.2624 15.6465 10.5541L15.155 10.2592L14.7071 10.7071C14.3166 11.0977 13.6834 11.0977 13.2929 10.7071C12.9024 10.3166 12.9024 9.68344 13.2929 9.29292L13.7408 8.84501L13.4459 8.35354C12.7377 7.17311 12.9237 5.66214 13.8971 4.68873L16.7929 1.79292C17.1834 1.40239 17.8166 1.40239 18.2071 1.79292Z" fill="none" stroke="none"></path> <path class="mesa-confirm" d="M8.20711 17.2071C8.59763 16.8166 8.59763 16.1834 8.20711 15.7929C7.81659 15.4024 7.18342 15.4024 6.7929 15.7929L1.2929 21.2929C0.902372 21.6834 0.902372 22.3166 1.2929 22.7071C1.68342 23.0977 2.31659 23.0977 2.70711 22.7071L8.20711 17.2071Z" fill="none" stroke="none"></path> 
      </svg>
    ${inputMesa.value.toString().toUpperCase()}`
    })
});

function obtenerFechaHoy() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Meses en JavaScript van de 0 a 11
    const día = String(hoy.getDate()).padStart(2, '0');
    return `${año}-${mes}-${día}`;
}

window.addEventListener('load', () => {
    for (let i = 0; i < 50; i++) {
        for (let j = 0; j < 15; j++) {
            const circle = document.createElement("circle")
            circle.setAttribute("cx", j*10+700)
            circle.setAttribute("cy", i*10-70)
            circle.setAttribute("r", 5)
            circle.setAttribute("fill", "none");
            circle.setAttribute("stroke", "black")
            document.querySelector("svg").appendChild(circle)
        }
    }
    let hoy = obtenerFechaHoy()
    inputFecha.value = hoy;
    inputFecha.min = hoy;

    let arraydata = inputFecha.value.split("")
    document.getElementById("rest-confirm-date").innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9H21M7 3V5M17 3V5M6 13H8M6 17H8M11 13H13M11 17H13M16 13H18M16 17H18M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg> ${arraydata[8]+arraydata[9]}/${arraydata[5]+arraydata[6]}/${arraydata[0]+arraydata[1]+arraydata[2]+arraydata[3]}
                ` 
                buscarTaula()
                
})

let initialDistance = null;

function getDistance(touches) {
    const [touch1, touch2] = touches;
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

svg.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches);
    }
});

svg.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && initialDistance !== null) {
        const currentDistance = getDistance(e.touches);
        if (currentDistance > initialDistance) {
            zoom("in",0.01);
        } else {
            zoom("out",0.01);
        }
        initialDistance = currentDistance;  // Actualiza la distancia inicial
    }
});

svg.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) {
        initialDistance = null;
    }
});

selectorFecha.addEventListener('click', function() {
    inputFecha.focus();  // Hacer foco en el input para que aparezca el selector de fecha
});

selectorPersonas.addEventListener('click', function() {
    inputPersonas.focus();  // Hacer foco en el input para que aparezca el selector de fecha
});

inputPersonas.addEventListener('change', function() {
    console.log(inputPersonas.value)
})

selectorHora.addEventListener('click', function() {
    inputHora.focus(); 
});

selectorMesa.addEventListener('click', function() {
    inputMesa.focus(); 
});

const scrollable = document.querySelector(".rest-map-top");
let isDown = false;
let startX2;
let scrollLeft;

scrollable.addEventListener('mousedown', (e) => {
    isDown = true;
    scrollable.classList.add('active');
    startX2 = e.pageX - scrollable.offsetLeft;
    scrollLeft = scrollable.scrollLeft;
});

scrollable.addEventListener('mouseleave', () => {
    isDown = false;
    scrollable.classList.remove('active');
});

scrollable.addEventListener('mouseup', () => {
    isDown = false;
    scrollable.classList.remove('active');
});

scrollable.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollable.offsetLeft;
    const walk = (x - startX2) * 2; // La cantidad de scroll, puedes ajustar este valor
    scrollable.scrollLeft = scrollLeft - walk;
});

function openPopup(){
    console.log("va")
    let div = document.getElementById("popup-reservar")
    div.style.display = 'flex';
    
    // Usar setTimeout para permitir que el navegador procese el cambio de display
    setTimeout(function() {
        div.classList.add('visible'); // Aplicar clase visible
    }, 10); // Un ligero retraso para que la transición funcione
}


function closePopup(){
    const divMesa = document.getElementById("rest-confirm-mesa");
    const divPersonas = document.getElementById("rest-confirm-personas");
    setTimeout(() => {
        divMesa.style.background = "";
        divMesa.style.border = "";
        divMesa.style.boxShadow = "";

        divPersonas.style.background = "";
        divPersonas.style.border = "";
        divPersonas.style.boxShadow = "";
    }, 100);
    let div = document.getElementById("popup-reservar")
    // Eliminar la clase visible para iniciar la transición
    div.classList.remove('visible');
    
    // Esperar que la transición termine antes de cambiar el display a none
    setTimeout(function() {
        div.style.display = 'none';
    }, 500); // Duración de la transición en ms
}

function acceder() {
    document.querySelector(".rest-login").style.paddingLeft = "0px";
    setTimeout(() => {
        document.querySelector(".rest-login").innerHTML = `
        <div>
            <div>
                <img src="./img/profile.svg" alt="">
            </div>
        </div>
        NAME`
    }, 100);
    document.querySelector(".rest-login").setAttribute("onclick","profile()");
}

function reservarNoAccountE() {
    document.getElementById("emp-crear-reserva").classList.add("visible")
}

function closePopupE() {
    document.getElementById("emp-crear-reserva").classList.remove("visible")
}

function reservarE() {
    closePopupE();
    resizeWindow();
    setTimeout(() => {
        document.querySelector(".rest-noti").classList.add("rest-noti-active")
        setTimeout(() => {
            document.querySelector(".rest-noti").classList.remove("rest-noti-active")
        }, 3000);
    }, 500);
    if(reservas[`${inputFecha.value}|${inputHora.value}`] == undefined){
        reservas[`${inputFecha.value}|${inputHora.value}`] = [];
    }
    const mesa = {
        num: inputMesa.value,
        name: document.getElementById("emp-name-res").value,
        lastname: document.getElementById("emp-lastname-res").value,
        phone: document.getElementById("emp-phone-res").value,
        mail: document.getElementById("emp-mail-res").value
    }
    reservas[`${inputFecha.value}|${inputHora.value}`].push(mesa);
    console.log(reservas)
    buscarTaula();
    for (let i = 0; i < mesas.length; i++) {
        mesas[i].classList.remove("rest-mesa-selected")
    }
}

function profile() {
    if(document.getElementById("rest-web-map").style.display == "none"){
        document.getElementById("rest-web-profile").style.display = "none";
        document.getElementById("rest-web-map").style.display = "";
        resizeWindow();
    }else{
        document.getElementById("rest-web-profile").style.display = "";
        document.getElementById("rest-web-map").style.display = "none";
    }
}

inputFecha.addEventListener("change", () => {
    let arraydata = inputFecha.value.split("")
    document.getElementById("rest-confirm-date").innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9H21M7 3V5M17 3V5M6 13H8M6 17H8M11 13H13M11 17H13M16 13H18M16 17H18M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg> ${arraydata[8]+arraydata[9]}/${arraydata[5]+arraydata[6]}/${arraydata[0]+arraydata[1]+arraydata[2]+arraydata[3]}
                ` 
                buscarTaula()
})

inputPersonas.addEventListener("change", () => {
    document.getElementById("rest-confirm-personas").innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
              ${inputPersonas.value} PERSONAS
    `
    buscarTaula()
})

inputHora.addEventListener("change" , () => {
    document.getElementById("rest-confirm-time").innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 7V12L14.5 13.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                ${inputHora.value}
              `
              buscarTaula()
})

inputMesa.addEventListener("change", () => {
    document.getElementById("rest-confirm-mesa").innerHTML = `
    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="black" stroke="none" xmlns="http://www.w3.org/2000/svg">
        <path class="mesa-confirm" fill-rule="evenodd" clip-rule="evenodd" d="M1.73306 1.03631C2.08026 0.94014 2.45235 1.03817 2.7071 1.29292L22.7071 21.2929C23.0976 21.6834 23.0976 22.3166 22.7071 22.7071C22.3166 23.0977 21.6834 23.0977 21.2929 22.7071L14 15.4142L12.9142 16.5C12.1341 17.2802 10.8684 17.2827 10.0865 16.5007L3.29296 9.70718C1.58311 7.99734 1.01881 6.00221 0.879106 4.46556C0.809325 3.698 0.844063 3.03552 0.896734 2.56147C0.926579 2.29285 0.964429 2.02212 1.02938 1.75935C1.11559 1.41264 1.38869 1.13169 1.73306 1.03631ZM2.87096 4.2852C2.98137 5.49843 3.41721 7.00301 4.70713 8.29291L11.5 15.0858L12.5858 14L2.87096 4.2852Z" fill="none" stroke="none"></path> <path class="mesa-confirm" d="M18.2071 1.79292C18.5976 2.18344 18.5976 2.81661 18.2071 3.20713L15.3113 6.10295C14.955 6.45919 14.9505 6.97388 15.1985 7.38727L18.7929 3.79292C19.1834 3.40239 19.8166 3.40239 20.2071 3.79292C20.5976 4.18344 20.5976 4.81661 20.2071 5.20713L16.6128 8.80148C17.0261 9.04952 17.5408 9.04498 17.8971 8.68873L20.7929 5.79292C21.1834 5.40239 21.8166 5.40239 22.2071 5.79292C22.5976 6.18344 22.5976 6.81661 22.2071 7.20713L19.3113 10.1029C18.3379 11.0764 16.8269 11.2624 15.6465 10.5541L15.155 10.2592L14.7071 10.7071C14.3166 11.0977 13.6834 11.0977 13.2929 10.7071C12.9024 10.3166 12.9024 9.68344 13.2929 9.29292L13.7408 8.84501L13.4459 8.35354C12.7377 7.17311 12.9237 5.66214 13.8971 4.68873L16.7929 1.79292C17.1834 1.40239 17.8166 1.40239 18.2071 1.79292Z" fill="none" stroke="none"></path> <path class="mesa-confirm" d="M8.20711 17.2071C8.59763 16.8166 8.59763 16.1834 8.20711 15.7929C7.81659 15.4024 7.18342 15.4024 6.7929 15.7929L1.2929 21.2929C0.902372 21.6834 0.902372 22.3166 1.2929 22.7071C1.68342 23.0977 2.31659 23.0977 2.70711 22.7071L8.20711 17.2071Z" fill="none" stroke="none"></path> 
      </svg>
    ${inputMesa.value.toString().toUpperCase()}`
    buscarTaula();
})

function reservar() {
    let r = false;
    if(inputMesa.value == ""){
        const divMesa = document.getElementById("rest-confirm-mesa");
        divMesa.style.background = "rgb(255 0 0 / 20%)";
        divMesa.style.border = "1px solid #ff0000";
        divMesa.style.boxShadow = "rgb(255, 255, 255) -8px -4px 8px 0px, rgb(209, 217, 230) 8px 4px 12px 0px, rgb(255 115 115 / 50%) 4px 4px 4px 0px inset, rgb(255 231 231) -4px -4px 4px 0px inset";
        r = true;
    }if(inputPersonas.value == 0){
        const divPersonas = document.getElementById("rest-confirm-personas");
        divPersonas.style.background = "rgb(255 0 0 / 20%)";
        divPersonas.style.border = "1px solid #ff0000";
        divPersonas.style.boxShadow = "rgb(255, 255, 255) -8px -4px 8px 0px, rgb(209, 217, 230) 8px 4px 12px 0px, rgb(255 115 115 / 50%) 4px 4px 4px 0px inset, rgb(255 231 231) -4px -4px 4px 0px inset";
        r = true;
    }
    console.log(inputPersonas.value)

    if(r){
        return;
    }
    closePopup()
    resizeWindow()
    setTimeout(() => {
        document.querySelector(".rest-noti").classList.add("rest-noti-active")
        setTimeout(() => {
            document.querySelector(".rest-noti").classList.remove("rest-noti-active")
        }, 3000);
    }, 500);
    if(reservas[`${inputFecha.value}|${inputHora.value}`] == undefined){
        reservas[`${inputFecha.value}|${inputHora.value}`] = [];
    }
    const mesa = {
        num: inputMesa.value,
        name: "NAME",
        lastname: "LASTNAME",
        phone: "+34 999 999 999",
        mail: "mail@mail.com",
        people: inputPersonas.value
    }
    reservas[`${inputFecha.value}|${inputHora.value}`].push(mesa);
    console.log(reservas)
    buscarTaula()

    const Content = `
    <div class="rest-profile-card-left">
      <div class="rest-profile-info">
        <svg style="height: 50%;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        ${document.getElementById("rest-confirm-personas").textContent}
      </div>
      <div class="rest-profile-info">
        <svg style="height: 50%;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9H21M7 3V5M17 3V5M6 13H8M6 17H8M11 13H13M11 17H13M16 13H18M16 17H18M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      ${document.getElementById("rest-confirm-date").textContent}
      </div>
      <div class="rest-profile-info">
        <svg style="height: 50%;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 7V12L14.5 13.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        ${document.getElementById("rest-confirm-time").textContent}
      </div>
      <div class="rest-profile-info">
        <svg style="height: 50%;" width="20px" height="20px" viewBox="0 0 24 24" fill="black" stroke="none" xmlns="http://www.w3.org/2000/svg">
          <path class="mesa-confirm" fill-rule="evenodd" clip-rule="evenodd" d="M1.73306 1.03631C2.08026 0.94014 2.45235 1.03817 2.7071 1.29292L22.7071 21.2929C23.0976 21.6834 23.0976 22.3166 22.7071 22.7071C22.3166 23.0977 21.6834 23.0977 21.2929 22.7071L14 15.4142L12.9142 16.5C12.1341 17.2802 10.8684 17.2827 10.0865 16.5007L3.29296 9.70718C1.58311 7.99734 1.01881 6.00221 0.879106 4.46556C0.809325 3.698 0.844063 3.03552 0.896734 2.56147C0.926579 2.29285 0.964429 2.02212 1.02938 1.75935C1.11559 1.41264 1.38869 1.13169 1.73306 1.03631ZM2.87096 4.2852C2.98137 5.49843 3.41721 7.00301 4.70713 8.29291L11.5 15.0858L12.5858 14L2.87096 4.2852Z" fill="none" stroke="none"></path> <path class="mesa-confirm" d="M18.2071 1.79292C18.5976 2.18344 18.5976 2.81661 18.2071 3.20713L15.3113 6.10295C14.955 6.45919 14.9505 6.97388 15.1985 7.38727L18.7929 3.79292C19.1834 3.40239 19.8166 3.40239 20.2071 3.79292C20.5976 4.18344 20.5976 4.81661 20.2071 5.20713L16.6128 8.80148C17.0261 9.04952 17.5408 9.04498 17.8971 8.68873L20.7929 5.79292C21.1834 5.40239 21.8166 5.40239 22.2071 5.79292C22.5976 6.18344 22.5976 6.81661 22.2071 7.20713L19.3113 10.1029C18.3379 11.0764 16.8269 11.2624 15.6465 10.5541L15.155 10.2592L14.7071 10.7071C14.3166 11.0977 13.6834 11.0977 13.2929 10.7071C12.9024 10.3166 12.9024 9.68344 13.2929 9.29292L13.7408 8.84501L13.4459 8.35354C12.7377 7.17311 12.9237 5.66214 13.8971 4.68873L16.7929 1.79292C17.1834 1.40239 17.8166 1.40239 18.2071 1.79292Z" fill="none" stroke="none"></path> <path class="mesa-confirm" d="M8.20711 17.2071C8.59763 16.8166 8.59763 16.1834 8.20711 15.7929C7.81659 15.4024 7.18342 15.4024 6.7929 15.7929L1.2929 21.2929C0.902372 21.6834 0.902372 22.3166 1.2929 22.7071C1.68342 23.0977 2.31659 23.0977 2.70711 22.7071L8.20711 17.2071Z" fill="none" stroke="none"></path> 
        </svg>
        ${document.getElementById("rest-confirm-mesa").textContent}
      </div>
      
    </div>
    <div class="rest-profile-card-right" >
      <button style="height: 100%; cursor: pointer; background: transparent; border: none; border-radius: 50%;">
      <svg style="height:80%" width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.3785 8.44975L11.4637 15.3647C11.1845 15.6439 10.8289 15.8342 10.4417 15.9117L7.49994 16.5L8.08829 13.5582C8.16572 13.1711 8.35603 12.8155 8.63522 12.5363L15.5501 5.62132M18.3785 8.44975L19.7927 7.03553C20.1832 6.64501 20.1832 6.01184 19.7927 5.62132L18.3785 4.20711C17.988 3.81658 17.3548 3.81658 16.9643 4.20711L15.5501 5.62132M18.3785 8.44975L15.5501 5.62132" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M5 20H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      </button>
      <button style="height: 100%; cursor: pointer; background: transparent; border: none;border-radius: 50%;">
      <svg style="height:80%" width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 11V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 11V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      </button>
    </div>
  `
  const cardProduct = document.createElement("div");
    cardProduct.classList.add("rest-profile-card")
    cardProduct.innerHTML = Content;
    document.getElementById("reservas").appendChild(cardProduct)

    document.getElementById("rest-confirm-mesa").innerHTML = `
    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="black" stroke="none" xmlns="http://www.w3.org/2000/svg">
        <path class="mesa-confirm" fill-rule="evenodd" clip-rule="evenodd" d="M1.73306 1.03631C2.08026 0.94014 2.45235 1.03817 2.7071 1.29292L22.7071 21.2929C23.0976 21.6834 23.0976 22.3166 22.7071 22.7071C22.3166 23.0977 21.6834 23.0977 21.2929 22.7071L14 15.4142L12.9142 16.5C12.1341 17.2802 10.8684 17.2827 10.0865 16.5007L3.29296 9.70718C1.58311 7.99734 1.01881 6.00221 0.879106 4.46556C0.809325 3.698 0.844063 3.03552 0.896734 2.56147C0.926579 2.29285 0.964429 2.02212 1.02938 1.75935C1.11559 1.41264 1.38869 1.13169 1.73306 1.03631ZM2.87096 4.2852C2.98137 5.49843 3.41721 7.00301 4.70713 8.29291L11.5 15.0858L12.5858 14L2.87096 4.2852Z" fill="none" stroke="none"></path> <path class="mesa-confirm" d="M18.2071 1.79292C18.5976 2.18344 18.5976 2.81661 18.2071 3.20713L15.3113 6.10295C14.955 6.45919 14.9505 6.97388 15.1985 7.38727L18.7929 3.79292C19.1834 3.40239 19.8166 3.40239 20.2071 3.79292C20.5976 4.18344 20.5976 4.81661 20.2071 5.20713L16.6128 8.80148C17.0261 9.04952 17.5408 9.04498 17.8971 8.68873L20.7929 5.79292C21.1834 5.40239 21.8166 5.40239 22.2071 5.79292C22.5976 6.18344 22.5976 6.81661 22.2071 7.20713L19.3113 10.1029C18.3379 11.0764 16.8269 11.2624 15.6465 10.5541L15.155 10.2592L14.7071 10.7071C14.3166 11.0977 13.6834 11.0977 13.2929 10.7071C12.9024 10.3166 12.9024 9.68344 13.2929 9.29292L13.7408 8.84501L13.4459 8.35354C12.7377 7.17311 12.9237 5.66214 13.8971 4.68873L16.7929 1.79292C17.1834 1.40239 17.8166 1.40239 18.2071 1.79292Z" fill="none" stroke="none"></path> <path class="mesa-confirm" d="M8.20711 17.2071C8.59763 16.8166 8.59763 16.1834 8.20711 15.7929C7.81659 15.4024 7.18342 15.4024 6.7929 15.7929L1.2929 21.2929C0.902372 21.6834 0.902372 22.3166 1.2929 22.7071C1.68342 23.0977 2.31659 23.0977 2.70711 22.7071L8.20711 17.2071Z" fill="none" stroke="none"></path> 
      </svg>
    MESA 0`
    buscarTaula();
}

const mesasPorPersona = [[],["Mesa 16", "Mesa 22"],["Mesa 14","Mesa 3", "Mesa 6", "Mesa 8", "Mesa 11", "Mesa 4", "Mesa 13", "Mesa 18"],["Mesa 21","Mesa 23","Mesa 15","Mesa 17"],["Mesa 1","Mesa 2","Mesa 5","Mesa 9","Mesa 10","Mesa 19","Mesa 20"],["Mesa 7","Mesa 12"]]

function buscarTaula(){
    let persones = inputPersonas.value;
    const dia = new Date(inputFecha.value)
    const hora = inputHora.value
    const mesa = inputMesa.value

    console.log(mesasPorPersona[persones]);
    if(persones > 5){
        persones = 5;
    }else if(persones < 0){
        persones = 1;
    }
    for (let i = 0; i < mesas.length; i++) {
        mesas[i].style.fill = ""
    }
    for (let index = 0; index < mesasPorPersona[persones].length; index++) {
        const element = mesasPorPersona[persones][index];
        console.log(mesas[0].parentElement.getAttribute("xlink:title"));
        for (let j = 0; j < mesas.length; j++) {
            if(mesas[j].parentElement.getAttribute("xlink:title") == element){
                mesas[j].style.fill = "#00800036";
            }
        }
    }

    const divCardMesas = document.querySelector(".rest-emp-right")
    divCardMesas.innerHTML = "";

    if(reservas[`${inputFecha.value}|${inputHora.value}`] != undefined){
        for (let i = 0; i < reservas[`${inputFecha.value}|${inputHora.value}`].length; i++) {
            const element = reservas[`${inputFecha.value}|${inputHora.value}`][i];
            const cardMesa = document.createElement("div");
            cardMesa.classList.add("rest-emp-right-card");
            cardMesa.setAttribute("id", element.num)
            cardMesa.innerHTML = `
            <h5 style="margin-left: 20px; margin-top: 20px; font-size: 18px; font-weight: 550;">${element.num.toUpperCase()}</h5>
            <p style="margin-left: 30px; margin-top: 5px;">Nombre: ${element.name}</p>
            <p style="margin-left: 30px; margin-top: 5px;">Apellidos: ${element.lastname}</p>
            <p style="margin-left: 30px; margin-top: 5px;">Telefono: ${element.phone}</p>
            <p style="margin-left: 30px; margin-top: 5px;">Mail: ${element.mail}</p>
            `
            if(element.people != undefined){
                cardMesa.innerHTML += `<p style="margin-left: 30px; margin-top: 5px;">Personas: ${element.people}</p>`
            }
            divCardMesas.appendChild(cardMesa);
            cardMesa.addEventListener("click", () => {
                if(cardMesa.classList.contains("rest-emp-right-card-selected")){
                    cardMesa.classList.remove("rest-emp-right-card-selected")
                    for (let j = 0; j < mesas.length; j++) {
                        mesas[j].classList.remove("rest-mesa-selected")
                    }
                }else{
                    cardMesa.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const cardMesas = document.querySelectorAll(".rest-emp-right-card");
                for (let j = 0; j < cardMesas.length; j++) {
                    cardMesas[j].classList.remove("rest-emp-right-card-selected")
                }
                for (let j = 0; j < mesas.length; j++) {
                    if(mesas[j].parentElement.getAttribute("xlink:title") == cardMesa.id){
                        mesas[j].classList.add("rest-mesa-selected")
                    }else{
                        mesas[j].classList.remove("rest-mesa-selected")
                    }
                }
                cardMesa.classList.add("rest-emp-right-card-selected")
                }
            })
            for (let j = 0; j < mesas.length; j++) {
                if(mesas[j].parentElement.getAttribute("xlink:title") == element.num){
                    console.log(windowN)
                    if(windowN == "client"){
                        mesas[j].style.fill = "#80000036";
                    }else{
                        mesas[j].style.fill = "#00800036";
                    }
                }
            }
        }
    }

    mesas.forEach(elementP => {
        if(elementP.style.fill == "rgba(128, 0, 0, 0.21)"){
            elementP.classList.remove("rest-mesa-selected")
            inputMesa.value = "";
        }else if(elementP.parentElement.getAttribute("xlink:title") == inputMesa.value){
            elementP.classList.add("rest-mesa-selected")
        }else{
            elementP.classList.remove("rest-mesa-selected")
        }
    })
}