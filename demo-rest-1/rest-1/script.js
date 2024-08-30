const restdarkModeStylesheet = document.getElementById("dark-mode-rest-stylesheet")
const restdarkModeToggle = document.getElementById('darkModeToggle');
const selectorFecha = document.getElementById('selectorFecha');
const inputFecha = document.getElementById('fecha');

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
/*
document.getElementById("taula1").addEventListener("mouseover", (event) => {
    const img = document.createElement("img");
    img.src = "./img/taula-1.png";
    console.log(img)
    img.classList.add("rest-img")
    img.setAttribute("id","taula-1")
    img.style.cursor = "pointer;"
    document.querySelector(".rest-map-bottom").appendChild(img)
})

document.getElementById("taula1").addEventListener("mouseout", (event) => {
    document.getElementById("taula-1").remove();
})*/

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

let viewBox = svg.getAttribute('viewBox').split(' ').map(Number); // [x, y, width, height]
 // Factor de zoom (10% por cada clic)

// Función para hacer zoom
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

document.addEventListener('wheel', function(event) {
    if (event.deltaY < 0) {
        zoom('in',0.1);
    } else if (event.deltaY > 0) {
        zoom('out',0.1)
    }
});

const mesas = svg.querySelectorAll(".rest-mesa");
console.log(mesas)

mesas.forEach(element => {
    element.addEventListener("click", () => {
        console.log(element.parentElement.getAttribute("xlink:title"))
        document.querySelector("#cliente span").innerHTML = element.parentElement.getAttribute("xlink:title")
        if(element.classList.contains("rest-mesa-selected")){
            element.classList.remove("rest-mesa-selected")
        }else{
            mesas.forEach(elementP => {
                elementP.classList.remove("rest-mesa-selected")
            })
            element.classList.add("rest-mesa-selected")
        }
    })
});

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
    inputFecha.valueAsDate = new Date();
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

console.log(selectorFecha,inputFecha)

selectorFecha.addEventListener('click', function() {
    inputFecha.style.display = 'block';  // Mostrar el input
    inputFecha.focus();  // Hacer foco en el input para que aparezca el selector de fecha
});