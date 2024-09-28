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