function p(){
    console.log("p")
    document.getElementById("proximamente").scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function r(){
    console.log("r")
    document.getElementById("restauracion").scrollIntoView({ behavior: 'smooth', block: 'center' });
}

window.addEventListener("load", () => {
    console.log("hi",document.getElementById("proximamente"))
    document.getElementById("proximamente").scrollIntoView({ behavior: 'smooth', block: 'center' });
})