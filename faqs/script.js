function prova(){
    if(document.getElementById("bottom").classList.contains("active")){
        document.getElementById("bottom").classList.remove("active");
        document.getElementById("question").classList.remove("active")
    }else{
        document.getElementById("bottom").classList.add("active");
        document.getElementById("question").classList.add("active")
    }
}