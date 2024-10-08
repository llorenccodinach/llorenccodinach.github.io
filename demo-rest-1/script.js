const cliente = document.getElementById('window-cliente');
const empresa = document.getElementById('window-empresa');
const radioInputs = document.querySelectorAll('.radio-input label input[type="radio"]');
const selection = document.querySelector('.selection');
const containerWidth = 300;
const restHStyle = document.getElementById("h-rest-stylesheet")
const restVStyle = document.getElementById("v-rest-stylesheet")

let horitzontal = true;
let windowN = "client";
let personesGuardades = 0;

radioInputs.forEach((radio, index) => {
    radio.addEventListener('change', () => {
        if (radio.checked) {

            if (index === 1) { 
                const translateValue = `translateX(${containerWidth / 2}px)`;
                selection.style.transform = translateValue;
            } else {
                selection.style.transform = 'translateX(0)'; 
            }

            if(radio.id == "input-cliente"){
                cliente.classList.add('center');
                cliente.classList.remove('offscreen-right');
                empresa.classList.add('offscreen-left');
                empresa.classList.remove('center');
                
                windowN = "client";
                document.querySelector(".button-rotate").setAttribute("for", "checkbox-rotate")

                if(horitzontal){
                    document.getElementById("checkbox-rotate").checked = false;
                }else{
                    document.getElementById("checkbox-rotate").checked = true;
                }

                inputPersonas.value = personesGuardades;
                
                const zooms = document.querySelectorAll(".rest-zoom-button");
                setTimeout(() => {
                    document.querySelector(".rest-map-bottom").appendChild(document.getElementById("svg"));
                    document.querySelector("#client-filters").insertBefore(selectorHora,document.querySelector("#client-filters").children[1])
                    document.querySelector("#client-filters").insertBefore(selectorFecha,document.querySelector("#client-filters").children[1])
                    for (let i = 0; i < zooms.length; i++) {
                        document.querySelector(".rest-map-bottom").appendChild(zooms[i])
                    }
                }, 100);
                
                resizeWindow();
                buscarTaula();
                
            }else if(radio.id == "input-empresa"){
                empresa.classList.remove('offscreen-left');
                empresa.classList.add('center');
                cliente.classList.remove('center');
                cliente.classList.add('offscreen-right');

                windowN = "empresa";

                personesGuardades = inputPersonas.value;
                inputPersonas.value = 0;

                document.getElementById("checkbox-rotate").checked = false;
                console.log(document.getElementById("checkbox-rotate"))

                document.querySelector(".button-rotate").setAttribute("for", "")

                let a = horitzontal;
                horitzontal = true;

                const zooms = document.querySelectorAll(".rest-zoom-button")
                setTimeout(() => {
                    document.querySelector("#aqui-svg").appendChild(document.getElementById("svg"));
                    document.querySelector("#aqui-filters").appendChild(selectorFecha);
                    document.querySelector("#aqui-filters").appendChild(selectorHora);
                    for (let i = 0; i < zooms.length; i++) {
                        document.querySelector("#aqui-svg").appendChild(zooms[i])
                    }
                }, 100);

                resizeWindow();

                buscarTaula();

                horitzontal = a;
            }
        }
    });
});

const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeStylesheet = document.getElementById('dark-mode-stylesheet');

if (localStorage.getItem('dark-mode') === 'enabled') {
    darkModeStylesheet.removeAttribute('disabled');
    darkModeToggle.checked = true;
}

function applyTransition() {
    let elements = document.querySelectorAll('*');

    elements.forEach(el => el.style.transition = "all 0.5s ease-in-out");

    document.querySelector(".rest-div-pages").style.transition = "clip-path 0.5s ease-in-out"

    document.querySelector(".radio-input").style.transition = ""
    document.querySelector("#empresa").style.transition = ""
    document.querySelector("#cliente").style.transition = ""

    setTimeout(() => {
        elements.forEach(el => el.style.transition = "");
    }, 500);
  }

darkModeToggle.addEventListener('click', () => {
    applyTransition()
    if (darkModeStylesheet.disabled) {
        darkModeStylesheet.removeAttribute('disabled');
        localStorage.setItem('dark-mode', 'enabled');
        darkModeToggle.textContent = 'Light Mode';
    } else {
        darkModeStylesheet.setAttribute('disabled', 'true');
        localStorage.setItem('dark-mode', 'disabled');
        darkModeToggle.textContent = 'Dark Mode';
    }
});

document.getElementById("checkbox-rotate").addEventListener('change', () => {
    if(windowN == "client"){
        if (document.getElementById("checkbox-rotate").checked) {
            horitzontal = false;
            resizeWindow();
        }else{
            horitzontal = true;
            resizeWindow();
        }
    }
    
});

window.addEventListener('resize', resizeWindow);
window.addEventListener('load', resizeWindow)



function resizeWindow(){
    const windows = document.querySelectorAll(".div-window")
    windows.forEach((window) => {
        const heightDiv = document.querySelector(".div-cliente-empresa").clientHeight*0.9
        const widthDiv = document.querySelector(".div-cliente-empresa").clientWidth*0.9
        if(horitzontal){
            if(heightDiv*16/9 > widthDiv){
                window.style.width = `${widthDiv}px`;
                window.style.height = `${widthDiv*9/16}px`;
            }else{
                window.style.width = `${heightDiv*16/9}px`;
                window.style.height = `${heightDiv}px`;
            }
            setTimeout(() => {
                restHStyle.removeAttribute('disabled')
                restVStyle.setAttribute('disabled', 'true')
            }, 100);
        }else{
            if(window.id == "window-empresa"){
                if(heightDiv*16/9 > widthDiv){
                    window.style.width = `${widthDiv}px`;
                    window.style.height = `${widthDiv*9/16}px`;
                }else{
                    window.style.width = `${heightDiv*16/9}px`;
                    window.style.height = `${heightDiv}px`;
                }
                setTimeout(() => {
                    restVStyle.removeAttribute('disabled')
                    restHStyle.setAttribute('disabled', 'true')
                }, 100);
            }else {
                if(heightDiv*9/16 > widthDiv){
                    window.style.width = `${widthDiv}px`;
                    window.style.height = `${widthDiv*16/9}px`;
                }else{
                    window.style.width = `${heightDiv*9/16}px`;
                    window.style.height = `${heightDiv}px`;
                }
                setTimeout(() => {
                    restHStyle.removeAttribute('disabled')
                    restVStyle.setAttribute('disabled', 'true')
                }, 100);
            }
            
        }
    })
    viewBoxSvg()
}

function viewBoxSvg() {
    document.querySelector(".loader").style.display = "block";
    document.querySelector("#aqui-svg").querySelector(".loader").style.display = "block";
    svg.setAttribute("viewBox", `0 0 0 0`)
    setTimeout(() => {
        let widthSVG = (svg.parentElement.clientWidth - 1410)/2;
        let heightSVG = (svg.parentElement.clientHeight - 980)/2;

        const container = svg.parentElement;
        
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
  
        const svgWidth = 1370;
        const svgHeight = 800;
  
        // Calcula la relación de aspecto del contenedor y del SVG
        const containerAspectRatio = containerWidth / containerHeight;
        const svgAspectRatio = svgWidth / svgHeight;
  
        let newViewBoxWidth, newViewBoxHeight;
  
        // Si el contenedor es más ancho proporcionalmente que el SVG
        if (containerAspectRatio > svgAspectRatio) {
          // Ajustar el ancho del SVG para que el alto se ajuste al contenedor
          newViewBoxHeight = svgHeight;
          newViewBoxWidth = svgHeight * containerAspectRatio;
        } else {
          // Ajustar el alto del SVG para que el ancho se ajuste al contenedor
          newViewBoxWidth = svgWidth;
          newViewBoxHeight = svgWidth / containerAspectRatio;
        }
  
        // Calcula el desplazamiento para centrar el SVG en el viewBox
        const offsetX = (newViewBoxWidth - svgWidth) / 2;
        const offsetY = (newViewBoxHeight - svgHeight) / 2;
  
        // Modifica el viewBox con los nuevos valores, centrando el SVG
        svg.setAttribute('viewBox', `${-140 - 50 - offsetX} ${ -280 - 50 - offsetY} ${newViewBoxWidth} ${newViewBoxHeight}`);
  

        //svg.setAttribute("viewBox", `${-140 - 10 - widthSVG} ${-280 - 10 - heightSVG} ${svg.parentElement.clientWidth} ${svg.parentElement.clientHeight}`)
        document.querySelector(".loader").style.display = "none";
        document.querySelector("#aqui-svg").querySelector(".loader").style.display = "none";
    }, 600);
}