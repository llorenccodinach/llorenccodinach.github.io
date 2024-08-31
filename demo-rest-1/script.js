const cliente = document.getElementById('window-cliente');
const empresa = document.getElementById('window-empresa');
const radioInputs = document.querySelectorAll('.radio-input label input[type="radio"]');
const selection = document.querySelector('.selection');
const containerWidth = 300;
let horitzontal = true;

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
            }else if(radio.id == "input-empresa"){
                empresa.classList.remove('offscreen-left');
                empresa.classList.add('center');
                cliente.classList.remove('center');
                cliente.classList.add('offscreen-right');
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
    const windows = document.querySelectorAll(".div-window");
    if (document.getElementById("checkbox-rotate").checked) {
        horitzontal = false;
        resizeWindow();
    }else{
        horitzontal = true;
        resizeWindow();
    }
});

window.addEventListener('resize', resizeWindow);
window.addEventListener('load', resizeWindow)

const restHStyle = document.getElementById("h-rest-stylesheet")
const restVStyle = document.getElementById("v-rest-stylesheet")

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
            if(heightDiv*9/16 > widthDiv){
                window.style.width = `${widthDiv}px`;
                window.style.height = `${widthDiv*16/9}px`;
            }else{
                window.style.width = `${heightDiv*9/16}px`;
                window.style.height = `${heightDiv}px`;
            }
            setTimeout(() => {
                restVStyle.removeAttribute('disabled')
            restHStyle.setAttribute('disabled', 'true')
            }, 100);
            
        }
    })
    viewBoxSvg()
}

function viewBoxSvg() {
    svg.setAttribute("viewBox", `0 0 0 0`)
    setTimeout(() => {
        console.log(svg.clientHeight, svg.clientWidth)
        svg.setAttribute("viewBox", `-160 -290 ${svg.clientWidth*2-10} ${svg.clientHeight*2-10}`)
        document.querySelector(".loader").style.display = "none";
    }, 600);
}