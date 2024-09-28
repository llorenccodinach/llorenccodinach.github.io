
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

dragBox.addEventListener('mousedown', (e) => {
    startX = e.clientX; // Posición inicial del mouse
    dragBox.style.cursor = 'grabbing'; // Cambia el cursor a "grabbing"
});

dragBox.addEventListener('mousemove', (e) => {
    if (startX !== undefined) {
        endX = e.clientX; // Posición actual del mouse
    }
    if (startX !== undefined && endX !== undefined) {
        const distance = endX - startX; // Calcula la distancia
        let direction;

        if (distance > 0) {
            direction = 'derecha';
        } else if (distance < 0) {
            direction = 'izquierda';
        } else {
            direction = 'ninguna';
        }

        console.log(`Arrastre hacia ${direction} a una distancia de ${Math.abs(distance)} px.`);
        const miDiv = dragBox;
        
        // Obtener el estilo computado
        const estilo = window.getComputedStyle(miDiv);
        
        // Obtener el valor de transform
        const transform = estilo.transform;

        // Verificar si hay un transform aplicado
        if (transform !== 'none') {
            // Extraer la matriz de transformación
            const matriz = transform.match(/matrix.*\((.+)\)/);
            if (matriz) {
                const valores = matriz[1].split(', ');
                const translateX = parseFloat(valores[4]); // El valor de translateX es el quinto elemento en la matriz
                dragBox.style.transform = `translateX(${translateX+distance}px)`
            }
        } else {
            dragBox.style.transform = `translateX(${distance}px)`
        }
    }
});

dragBox.addEventListener('mouseup', () => {
    if (startX !== undefined && endX !== undefined) {
        const distance = endX - startX; // Calcula la distancia
        let direction;

        if (distance > 0) {
            direction = 'derecha';
        } else if (distance < 0) {
            direction = 'izquierda';
        } else {
            direction = 'ninguna'; // No hubo movimiento
        }

        console.log(`Arrastre hacia ${direction} a una distancia de ${Math.abs(distance)} px.`);

        if(Math.abs(distance) > 100){
            if(direction == 'izquierda'){
                dragBox.classList.remove("wrapper-1")
                dragBox.classList.add("wrapper-2")
            } else{
                dragBox.classList.remove("wrapper-2")
                dragBox.classList.add("wrapper-1")
            }
        }
    }

    dragBox.style.transform = "";

    

    // Reinicia las variables
    startX = undefined;
    endX = undefined;
    dragBox.style.cursor = 'grab'; // Vuelve a cambiar el cursor
});

// Para dispositivos táctiles
dragBox.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX; // Posición inicial del toque
    dragBox.style.cursor = 'grabbing';
});

dragBox.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX; // Posición actual del toque
    if (startX !== undefined && endX !== undefined) {
        const distance = endX - startX; // Calcula la distancia
        let direction;

        if (distance > 0) {
            direction = 'derecha';
        } else if (distance < 0) {
            direction = 'izquierda';
        } else {
            direction = 'ninguna';
        }

        console.log(`Arrastre hacia ${direction} a una distancia de ${Math.abs(distance)} px.`);
        
        
        const miDiv = dragBox;
        
        // Obtener el estilo computado
        const estilo = window.getComputedStyle(miDiv);
        
        // Obtener el valor de transform
        const transform = estilo.transform;

        // Verificar si hay un transform aplicado
        if (transform !== 'none') {
            // Extraer la matriz de transformación
            const matriz = transform.match(/matrix.*\((.+)\)/);
            if (matriz) {
                const valores = matriz[1].split(', ');
                const translateX = parseFloat(valores[4]); // El valor de translateX es el quinto elemento en la matriz
                dragBox.style.transform = `translateX(${translateX+distance}px)`
            }
        } else {
            dragBox.style.transform = `translateX(${distance}px)`
        }
    }
});

dragBox.addEventListener('touchend', () => {
    if (startX !== undefined && endX !== undefined) {
        const distance = endX - startX; // Calcula la distancia
        let direction;

        if (distance > 0) {
            direction = 'derecha';
        } else if (distance < 0) {
            direction = 'izquierda';
        } else {
            direction = 'ninguna';
        }

        console.log(`Arrastre hacia ${direction} a una distancia de ${Math.abs(distance)} px.`);

        if(Math.abs(distance) > 100){
            if(direction == 'izquierda'){
                dragBox.classList.remove("wrapper-1")
                dragBox.classList.add("wrapper-2")
            } else{
                dragBox.classList.remove("wrapper-2")
                dragBox.classList.add("wrapper-1")
            }
        }
    }

    dragBox.style.transform = "";
    
    startX = undefined;
    endX = undefined;
    dragBox.style.cursor = 'grab';
});
