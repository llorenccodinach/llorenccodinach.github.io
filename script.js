
function r(){
    document.querySelector(".demos-wrapper").classList.remove("wrapper-2");
    document.querySelector(".demos-wrapper").classList.add("wrapper-1");
}

function p(){
    document.querySelector(".demos-wrapper").classList.remove("wrapper-1");
    document.querySelector(".demos-wrapper").classList.add("wrapper-2");
}

window.addEventListener("load", () => {
    console.log("hi",document.getElementById("proximamente"))
    document.getElementById("proximamente").scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.querySelector("body").style.overflow = 'hidden';

    this.window.scroll(0,0);
    this.window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth' // O 'auto' para un desplazamiento instantáneo
      });
    console.log("ho fa ")
    setTimeout(() => {
        this.window.scroll(0,0);
        this.window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' // O 'auto' para un desplazamiento instantáneo
          });
    }, 100);
})

window.addEventListener('scroll', function() {
    this.window.scroll(0,0);
    this.window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth' // O 'auto' para un desplazamiento instantáneo
      });
    console.log("ho fa ")
    setTimeout(() => {
        this.window.scroll(0,0);
        this.window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' // O 'auto' para un desplazamiento instantáneo
          });
    }, 100);
});

document.addEventListener('touchmove', function(e) {
    e.preventDefault(); // Previene el scroll en pantallas táctiles
}, { passive: false });

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