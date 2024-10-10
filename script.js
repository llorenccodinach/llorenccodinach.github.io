
function r(){
    document.querySelector(".demos-wrapper").classList.remove("wrapper-2");
    document.querySelector(".demos-wrapper").classList.add("wrapper-1");
}

function p(){
    document.querySelector(".demos-wrapper").classList.remove("wrapper-1");
    document.querySelector(".demos-wrapper").classList.add("wrapper-2");
}

const dragBox = document.getElementById('carousel');

let startX;
let endX;
let sumTrans;

function dragUp(){
    if (startX !== undefined && endX !== undefined) {
        const distance = endX - startX; // Calcula la distancia

        if(distance > 100){
            dragBox.classList.remove("wrapper-2")
            dragBox.classList.add("wrapper-1")
        }else if(distance < -100){
            dragBox.classList.remove("wrapper-1")
            dragBox.classList.add("wrapper-2")
        }
    }

    dragBox.style.transform = "";

    startX = undefined;
    endX = undefined;
    dragBox.style.transition = "";
}

dragBox.addEventListener('mousemove', (e) => {
    if (startX !== undefined) {
        endX = e.clientX;
    }
    if (startX !== undefined && endX !== undefined) {
        const distance = endX - startX;
        
        dragBox.style.transform = `translateX(${sumTrans+distance}px)`
    }
});
dragBox.addEventListener('mouseup', dragUp);

dragBox.addEventListener('mousedown', (e) => {
    dragBox.style.transition = "0s";
    startX = e.clientX;
    sumTrans = parseFloat(window.getComputedStyle(dragBox).transform.match(/matrix.*\((.+)\)/)[1].split(', ')[4]); 
});

dragBox.addEventListener('touchstart', (e) => {
    dragBox.style.transition = "0s";
    startX = e.touches[0].clientX;
    sumTrans = parseFloat(window.getComputedStyle(dragBox).transform.match(/matrix.*\((.+)\)/)[1].split(', ')[4]); 
});

dragBox.addEventListener('touchmove', (e) => {
    if (startX !== undefined) {
        endX = e.touches[0].clientX;
    }
    if (startX !== undefined && endX !== undefined) {
        const distance = endX - startX;
        
        dragBox.style.transform = `translateX(${sumTrans+distance}px)`
    }
});

dragBox.addEventListener('touchend', dragUp);

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function create(numTriangles){
    let delay = 0;
    let a = "";
    for (let i = 0; i < numTriangles; i++) {
        const tri = document.createElement('div');
        tri.classList.add('tri');
        
        const coloral = randomBetween(50, 205)
        const color = `rgb(${coloral} ${coloral} ${coloral})`;
    
        tri.style.borderTop = `100px solid ${color}`;
        tri.style.borderRight = '100px solid transparent';
        tri.style.borderLeft = '100px solid transparent';
    
        const canto = randomBetween(0,1);
        const posicio = randomBetween(-70,70);
        let x,y;
        if(canto < 0.25){
            x = posicio;
            y = -100;
        }else if(canto < 0.5){
            x = posicio;
            y = -100;
        }else if(canto < 0.75){
            x = -150;
            y = posicio;
        }else{
            x = -150;
            y = posicio;
        }
        const scale = randomBetween(0.1, 1);
        tri.style.setProperty('--start-x', `${x}vw`);
        tri.style.setProperty('--start-y', `${y}vh`);
        tri.style.setProperty('--start-scale', scale);
    
        const duration = randomBetween(20, 25);
        tri.style.animation = `tornado ${duration}s infinite ease-in-out`;
        tri.style.animationDelay = `${delay}s`;
    
        document.body.appendChild(tri);
        delay -= 0.2;

        const rotateS = parseInt(randomBetween(0,360))

        a += `
        .tri:nth-child(${i+1}) {
            border-top: 100px solid ${color};
            transform: rotate(138deg) translate(0, 0) scale(0);
            animation: anim${i+1} ${duration}s infinite ease-in-out;
            animation-delay: ${delay}s;
        }
        
        @keyframes anim${i+1} {
            0% {
                opacity: 1;
                transform: rotate(${rotateS+200}deg) translate(${x}vw, ${y}vh) scale(${scale});
            }
            50%{
                opacity: 0.8;
            }
            100% {
                opacity: 0;
                transform: rotate(${rotateS}deg) translate(-50%, -50%) scale(0);
            }
        }
        `
    }
    console.log(a)
}
