const restdarkModeStylesheet = document.getElementById("dark-mode-rest-stylesheet")
const restdarkModeToggle = document.getElementById('darkModeToggle');

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
const zoomFactor = 0.1; // Factor de zoom (10% por cada clic)

// Función para hacer zoom
function zoom(inOut) {
    svg.style.transition = 'all 0.3s ease'; 
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
zoomInButton.addEventListener('click', () => zoom('in'));
zoomOutButton.addEventListener('click', () => zoom('out'));

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
      const clientX = evt.type === 'touchmove' ? evt.touches[0].clientX : evt.clientX;
      const clientY = evt.type === 'touchmove' ? evt.touches[0].clientY : evt.clientY;
  
      // Calcular la diferencia en la posición
      const dx = (startX - clientX) * (viewBox[2] / svg.clientWidth) * 1.25;
      const dy = (startY - clientY) * (viewBox[3] / svg.clientHeight);
  
      // Actualizar el viewBox del SVG
      svg.setAttribute('viewBox', `${viewBoxX + dx} ${viewBoxY + dy} ${viewBox[2]} ${viewBox[3]}`);
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

document.addEventListener('wheel', function(event) {
    if (event.deltaY < 0) {
        zoom('in');
    } else if (event.deltaY > 0) {
        zoom('out')
    }
});

const mesas = svg.querySelectorAll("a");
const paths = svg.querySelectorAll(".rest-mesa")
console.log(mesas)
mesas.forEach(element => {
    element.addEventListener("click", () => {
        if(element.querySelector("path").style.strokeWidth == "3px"){
            element.querySelector("path").style.strokeWidth = "1px";
            element.querySelector("path").style.fill = "transparent";
        }else{
            paths.forEach(element => {
                element.style.strokeWidth = "1px";
                element.style.fill = "";
            });
            element.querySelector("path").style.strokeWidth = "3px";
            element.querySelector("path").style.fill = "#e8e8e8";
        }
    })
});