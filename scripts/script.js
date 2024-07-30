let competitors;

const numberOptionsEU = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
};

const numberOptionsEU1 = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    useGrouping: true
};

const numberOptionsEN = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false
};

function saveToStorage(category, data) {
    let save = JSON.parse(localStorage.getItem('BPricingTool')) || {};
    save[category] = data;
    localStorage.setItem('BPricingTool', JSON.stringify(save));
}

function loadFromStorage(category) {
    let storage = JSON.parse(localStorage.getItem('BPricingTool')) || {};
    return storage[category];
}

function columnLetterToNumber(columnLetter) {
    let columnNumber = 0;
    const length = columnLetter.length;
    for (let i = 0; i < length; i++) {
        columnNumber *= 26;
        columnNumber += columnLetter.charCodeAt(i) - ('A'.charCodeAt(0) - 1);
    }
    return columnNumber;
}

document.getElementById("sumDiscount").addEventListener("click",  (e) => {
    if(e.target.closest("#div-discount-bofill").querySelector("input").value < 99){
        e.target.closest("#div-discount-bofill").querySelector("input").value++;
        
        let event = new Event('input');
        document.getElementById("discount-bofill").dispatchEvent(event);
    }
});
document.getElementById("restDiscount").addEventListener("click",  (e) => {
    if(e.target.closest("#div-discount-bofill").querySelector("input").value > 0){
        e.target.closest("#div-discount-bofill").querySelector("input").value--;

        let event = new Event('input');
        document.getElementById("discount-bofill").dispatchEvent(event);
    }
});

let id_product = 0;
let productEdit;
let windowName = "";
let windowDateCreated = createName();

function createName(){
    let fechaActual = new Date();
                
    let dia = fechaActual.getDate();
    let mes = fechaActual.getMonth() + 1; 
    let año = fechaActual.getFullYear();
    let horas = fechaActual.getHours();
    let minutos = fechaActual.getMinutes();
    let segundos = fechaActual.getSeconds();
    
    dia = (dia < 10) ? '0' + dia : dia;
    mes = (mes < 10) ? '0' + mes : mes;
    horas = (horas < 10) ? '0' + horas : horas;
    minutos = (minutos < 10) ? '0' + minutos : minutos;
    segundos = (segundos < 10) ? '0' + segundos : segundos;

    return `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
}

function removeCompetitor(e){
    document.querySelector(".comparar-mes").style.display = "flex";
    document.querySelector(".container").style.paddingRight = "0px";

    const card = e.closest(".card-container")
    if(card.querySelector('.select-competitor').value != "COMPETIDOR"){
        try{
            document.getElementById(`popup-${card.id}`).remove()
        }catch{}
    }
    card.remove()
}



function closePopup(){
    let a = document.querySelectorAll(".popup");
    for (let i = 0; i < a.length; i++) {
        a[i].style.visibility = "hidden";
    }
}

function doError(name){
    document.getElementById("popup-error").style.visibility = "visible";
    document.getElementById("popup-error").querySelector("h3").innerHTML = `ERROR: ${name}`
}

function closePopupError(){
    document.getElementById("popup-error").style.visibility = "hidden";
}

function loadPrice(e){
    e.target.closest(".product-card").querySelector("#value-input").innerHTML = e.target.value;
    const card = e.target.closest(".product-card")
    const a = card.querySelector("#price-unit").innerHTML
    const price = (e.target.value * parseFloat(a.substring(0, a.length - 3).replace(/\./g, '').replace(/,/g, '.')));
    card.querySelector("#price").innerHTML = `${price.toLocaleString('es-ES', numberOptionsEU)}¤`
    let discount = document.getElementById("discount-bofill").value
    if(discount >= 100 || discount < 0){
        document.getElementById("discount-bofill").value = 0
        discount = 0
    }
    card.querySelector("#netprice").innerHTML = `${(price*(100-discount)/100).toLocaleString('es-ES', numberOptionsEU)}¤`
    card.querySelector("#price-unit-netprice").innerHTML = `${(parseFloat(a.substring(0, a.length - 3).replace(/\./g, '').replace(/,/g, '.'))*(100-discount)/100).toLocaleString('es-ES', numberOptionsEU)}¤/u`
    loadTotal()
}

function loadTotal(){
    let a = document.getElementById('Bofill').querySelectorAll('.product-card')
    var totalPvpPrice = 0.0;
    var totalNetPrice = 0.0;
    for (let i = 0; i < a.length; i++) {
        totalPvpPrice += parseFloat(a[i].querySelector('#price').innerHTML.slice(0, -1).replace(/\./g, '').replace(/,/g, '.'));
        totalNetPrice += parseFloat(a[i].querySelector('#netprice').innerHTML.slice(0, -1).replace(/\./g, '').replace(/,/g, '.'));
    }
    document.getElementById('total-pvpprice').innerHTML = `${totalPvpPrice.toLocaleString('es-ES', numberOptionsEU)}¤`
    document.getElementById('total-netprice').innerHTML = `${totalNetPrice.toLocaleString('es-ES', numberOptionsEU)}¤`
}

function removeProduct(e){
    const card = e.closest(".product-card")
    card.remove()
    for(let i=1; i<3; i++){
        try{
            let prod = document.querySelectorAll('.card-container')[i].querySelectorAll(".product-card")
            for(let j=0; j<prod.length;j++){
                if(prod[j].id == card.id){
                    prod[j].remove()
                    break
                }
            }
        }catch (error) {
        }
    }
    loadTotal()
}

function changeColor(e){
    for(let i=1; i<document.querySelectorAll('.card-container').length; i++){
        let bofill = document.getElementById("Bofill").querySelectorAll(".product-card")
        for(let j=0; j<bofill.length; j++){
            if(bofill[j].id == e.currentTarget.id){
                if(e.type=="mouseover"){
                    bofill[j].classList.add("hover")
                }else{
                    bofill[j].classList.remove("hover")
                }
            }
        }
        let prod = document.querySelectorAll('.card-container')[i].querySelectorAll(".product-card")
        for(let j=0; j<prod.length; j++){
            if(prod[j].id == e.currentTarget.id){
                if(e.type=="mouseover"){
                    prod[j].classList.add("hover")
                }else{
                    prod[j].classList.remove("hover")
                }
                break
            }
        }
    }
}

function color(e){
    let a = document.querySelectorAll(".filtre")
    for (let i = 0; i < a.length; i++) {
        a[i].style.borderWidth = "1px"
    }
    e.style.borderWidth = "3px"
}

function getCompetitor(a,putFirstProducts) {
    var fileUrl = `../${a.querySelector(".select-competitor").value}.xlsx`;
    fetch(fileUrl)
        .then(response => response.arrayBuffer())
        .then(data => {
            a.querySelector("#competitorvsbofill").innerHTML = `${a.querySelector(".select-competitor").value.toUpperCase()} VS BOFILL`
            let diametersWithoutDuplicatesC = [];
            let productsAdd = [];
            document.body.style.cursor = 'wait';
            a.querySelector(".loader").style.display = "block";
            const discount = a.querySelector(".input-discount")
            a.querySelector(".select-competitor").disabled = true;

            let competitorInfo = competitorsJSON[a.querySelector(".select-competitor").value]

            const Content = `<div class="popup-card"><h3 style="font-size: 30px;margin: 40px;">${a.querySelector(".select-competitor").value.toUpperCase()}</h3><button style="top:30px;right: 30px;" class="cross close"><span style="transform: translateX(-50%) rotate(45deg);" class="cross-X"></span><span style="transform: translateX(-50%) rotate(-45deg);" class="cross-Y"></span></button><div class="popup-filtre-competitor"><div id="name" class="filtre"><input id="nombre" style="text-transform:none;" placeholder="NOMBRE" type="text"></div><div id="reference" class="filtre"><input id="referencia" placeholder="REFERENCIA" type="text"></div><div id="div-filtre" class="filtre"><select id="filtre-familia" class="select-filtre" name="FAMILIA" title="FAMILIA"><option value="" disabled="" selected="">FAMILIA</option></select><select id="filtre-subfamilia" class="select-filtre" name="SUBFAMILIA" title="SUBFAMILIA"><option value="" disabled="" selected="">SUBFAMILIA</option></select><select id="filtre-diametro" class="select-filtre" name="DIAMETRO" title="DIAMETRO"><option value="" selected="">DIÁMETRO</option></select></div><div id="ean" class="filtre"><input id="codigoean" placeholder="CÓDIGO EAN" type="text"></div><button class="filtre-delete"><img loading="lazy" style="height: 30px;" src="./img/borrar-filtres.svg" onerror="this.onerror=null; this.src='https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg';" alt=""></button></div><div id="all-products-popup" style="overflow-y: scroll;height: 573px; width: 100%;margin-top: 2em;"><div class="products-created" style="width: 500px; width: 100%;display: flex; flex-wrap: wrap;justify-content: center; gap: 2rem;"><div class="card-create-product"><button style="background-color: #b2b2b2;position: relative;" class="cross add"><span style="transform: translateX(-52%) rotate(0deg);" class="cross-X"></span><span style="transform: translateX(-52%) rotate(90deg);" class="cross-Y"></span></button></div></div><hr class="hr-created" style="background-color: #333;height: 5px;margin-left: 5%; width: 90%; margin-top: 30px;margin-bottom: 30px;"><div class="products-favorites" style="width: 500px; width: 100%;display: flex; flex-wrap: wrap;justify-content: center; gap: 2rem;"></div><hr class="hr-favorites" style="background-color: rgb(51, 51, 51); height: 5px; margin-left: 5%; width: 90%; margin-top: 30px; margin-bottom: 30px; display: block;"><div class="products-competitor"></div> <div class="products-favorites" style="height: 100px;width: 100%;display: flex;flex-wrap: wrap;justify-content: center;gap: 2rem;align-items: center;"><button title="Página anterior" id="page-before" style="opacity: 50%;height: 50px;width: 50px;background: #b2b2b2;border: none;border-radius: 25px;cursor: pointer;"><img style="height: 50px; width: 50px;" src="./img/arrow-left.svg" alt=""></button><h4 id="pages-counting">1/1</h4><button title="Página siguiente" id="page-next" style="height: 50px; width: 50px; background: rgb(178, 178, 178); border: none; border-radius: 25px; cursor: pointer; opacity: 1;"><img style="height: 50px; width: 50px;" src="./img/arrow-right.svg" alt=""></button></div></div></div>`
            const popup = document.createElement("div");
            popup.setAttribute("id", `popup-${a.id}`)
            popup.setAttribute("class", "popup")
            popup.innerHTML = Content;
            document.getElementById("page").append(popup);
            popup.querySelector(".close").addEventListener('click',closePopup)
            popup.querySelector(".filtre-delete").addEventListener("mousedown", (event) => {
                deleteFilters();
            });
            popup.querySelector(".filtre-delete").addEventListener("mouseup", (event) => {
                popup.querySelector(".filtre-delete").style.borderWidth = "1px";
            });
            
            
            let haveName = false;
            if(competitorInfo.name != "") haveName = true;
            let haveDescription = false;
            if(competitorInfo.description != "") haveDescription = true;
            let haveEan = false;
            if(competitorInfo.eanCode != "") haveEan = true;
            let haveReference = false;
            if(competitorInfo.reference != "") haveReference = true;
            let havePvp = false;
            if(competitorInfo.pvp != "") havePvp = true;
            let haveFamily = false;
            if(competitorInfo.family != "") haveFamily = true;
            let haveSubfamily = false;
            if(competitorInfo.subfamily != "") haveSubfamily = true;
            let haveDiameter = false;
            if(competitorInfo.diameter != "") haveDiameter = true;
            let haveInletdiameter = false;
            if(competitorInfo.inletDiameter != "") haveInletdiameter = true;
            let haveOutletdiameter = false;
            if(competitorInfo.outletDiameter != "") haveOutletdiameter = true;
            
            let names = []
            let descriptions = []
            let eans = []
            let references = []
            let pvps = []
            let families = []
            let subfamilies = []
            let diameters = []

            let products;

            const worker = new Worker('./scripts/worker.js');
            worker.postMessage({
                data:data,
                startingRow: competitorInfo.startingRow,
                columnImage: undefined,
                columnName: competitorInfo.name,
                columnDescription: competitorInfo.description,
                columnEanCode: competitorInfo.eanCode,
                columnReference: competitorInfo.reference,
                columnPvp: competitorInfo.pvp,
                columnFamily: competitorInfo.family,
                columnSubfamily: competitorInfo.subfamily,
                columnDiameter: competitorInfo.diameter,
                columnInletDiameter: competitorInfo.inletDiameter,
                columnOutletDiameter: competitorInfo.outletDiameter,
                columnAdditionalFamily1: undefined,
                columnAdditionalFamily2: undefined,
                columnAdditionalFamily3: undefined,
                columnAdditionalFamily4: undefined,
                columnAdditionalFamily5: undefined,
            });
            worker.onmessage = function (e) {
                diameters = e.data.diameters
                products = e.data.products
                

                names = products.map(product => product.name);
                descriptions = products.map(product => product.description);
                eans = products.map(product => product.ean);
                references = products.map(product => product.reference);
                pvps = products.map(product => product.pvp);
                families = products.map(product => product.family);
                subfamilies = products.map(product => product.subfamily);

                delete products;

                if (!haveReference) {
                    popup.querySelector("#reference").remove()
                }else{
                    popup.querySelector("#referencia").addEventListener("input", (event) => {
                        searchByREF(popup.querySelector("#referencia").value)
                    });
                    popup.querySelector("#reference").addEventListener("mousedown", (event) => {
                        searchByREF(popup.querySelector("#referencia").value)
                    });
                }
                
                if (!haveName) {
                    popup.querySelector("#name").remove()
                }else{
                    popup.querySelector("#nombre").addEventListener("input", (event) => {
                        searchByNAME(popup.querySelector("#nombre").value)
                    });
                    popup.querySelector("#name").addEventListener("mousedown", (event) => {
                        searchByNAME(popup.querySelector("#nombre").value)
                    });
                }
                
                if (!haveEan) {
                    popup.querySelector("#ean").remove()
                }else{
                    popup.querySelector("#codigoean").addEventListener("input", (event) => {
                        searchByEAN(popup.querySelector("#codigoean").value);
                    });
                    popup.querySelector("#ean").addEventListener("mousedown", (event) => {
                        searchByEAN(popup.querySelector("#codigoean").value);
                    });
                }

                
                
                if (!haveDiameter && !haveSubfamily && !haveFamily && !haveInletdiameter && !haveOutletdiameter) {
                    popup.querySelector("#div-filtre").remove()
                }else{
                    popup.querySelector("#div-filtre").addEventListener("mousedown", (event) => {
                        searchByFILTRE();
                    });
                    if(!haveDiameter && !haveInletdiameter && !haveOutletdiameter){
                        popup.querySelector("#filtre-diametro").style.display = "none";
                    }else{
                        const arrayDiam = Array.from(new Set(diameters))
                        const numbers = arrayDiam.filter(item => typeof item === 'number');
                        const strings = arrayDiam.filter(item => typeof item === 'string');

                        numbers.sort((a, b) => a - b);
                        strings.sort();

                        diametersWithoutDuplicatesC = [...numbers, ...strings];

                        let inputDiameter = popup.querySelector("#filtre-diametro");

                        inputDiameter.innerHTML = `<option value="">DIÁMETRO</option>`;

                        for (let i = 0; i < diametersWithoutDuplicatesC.length; i++) {
                            const newOption = document.createElement('option');
                            newOption.value = diametersWithoutDuplicatesC[i];
                            newOption.text = `Ø${diametersWithoutDuplicatesC[i]}`;
                            inputDiameter.appendChild(newOption)
                        }
                        inputDiameter.addEventListener("change", (event) => {
                            searchByFILTRE();
                        });
                    }
                    if(!haveSubfamily){
                        popup.querySelector("#filtre-subfamilia").style.display = "none";
                    }else{
                        const subfamiliesWithoutDuplicates = Array.from(new Set(subfamilies))

                        let inputSubfamilies = popup.querySelector("#filtre-subfamilia");
                        for (let i = 0; i < subfamiliesWithoutDuplicates.length; i++) {
                            const newOption = document.createElement('option');
                            newOption.value = subfamiliesWithoutDuplicates[i];
                            newOption.text = subfamiliesWithoutDuplicates[i];
                            inputSubfamilies.appendChild(newOption)
                        }
                        inputSubfamilies.addEventListener("change", (event) => {
                            popup.querySelector("#filtre-diametro").value = "";
                            searchByFILTRE();
                        });
                    }
                    if(!haveFamily){
                        popup.querySelector("#filtre-familia").style.display = "none";
                    }else{
                        const familiesWithoutDuplicates = Array.from(new Set(families))

                        let inputFamilies = popup.querySelector("#filtre-familia");

                        for (let i = 0; i < familiesWithoutDuplicates.length; i++) {
                            const newOption = document.createElement('option');
                            newOption.value = familiesWithoutDuplicates[i];
                            newOption.text = familiesWithoutDuplicates[i];
                            inputFamilies.appendChild(newOption)
                        }
                        popup.querySelector("#filtre-familia").addEventListener("change", (event) => {
                            popup.querySelector("#filtre-diametro").value = "";
                            let diametersRepetits = [];
                    
                            let searchedFam = popup.querySelector("#filtre-familia").value
                            for (let i = 0; i < families.length; i++) {
                                if(families[i] == searchedFam && (haveDiameter || (haveInletdiameter && haveOutletdiameter))){
                                    diametersRepetits.push(diameters[i])
                                }
                            }
                            const arrayDiam = Array.from(new Set(diametersRepetits))
                            const numbers = arrayDiam.filter(item => typeof item === 'number');
                            const strings = arrayDiam.filter(item => typeof item === 'string');
                            numbers.sort((a, b) => a - b);
                            strings.sort();
                            const diametersWithoutDuplicates = [...numbers, ...strings];

                            let inputDiameter = popup.querySelector("#filtre-diametro");
                        
                            inputDiameter.innerHTML = `<option value="">DIÁMETRO</option>`;
                        
                            for (let i = 0; i < diametersWithoutDuplicates.length; i++) {
                                const newOption = document.createElement('option');
                                newOption.value = diametersWithoutDuplicates[i];
                                newOption.text = `Ø${diametersWithoutDuplicates[i]}`;
                                inputDiameter.appendChild(newOption)
                            }
                            searchByFILTRE();
                        });
                    }
                }
                document.body.style.cursor = 'default';
                a.querySelector(".loader").style.display = "none";
                addFirstElements();

                const productes = document.getElementById("Bofill").querySelectorAll(".product-card")
                const productesCompetitor = a.querySelectorAll(".product-card");
                for (let i = 0; i < productes.length; i++) {
                    for (let j = 0; j < productesCompetitor.length; j++) {
                        if(productes[i].id == productesCompetitor[j].id){
                            productes[i].querySelector(".quantity-product").addEventListener('input', (event) => {
                                loadPrice();
                            });
                            productes[i].querySelector(".diam-product").addEventListener('change', (event) => {
                                loadPrice();
                            });
                            productes[i].querySelector(".cross").addEventListener('click', (event) => {
                                loadPrice();
                            });
                            document.querySelector("#discount-bofill").addEventListener('input', (event) => {
                                loadPrice();
                            });
                            a.querySelector(".input-discount").addEventListener('input', (event) => {
                                loadPrice();
                            });
                            const eventoClick = new Event('input');
    
                            // Despachar el evento en el elemento
                            a.querySelector(".input-discount").dispatchEvent(eventoClick);
                        }
                    }
                }
                loadTotal();
            };
            worker.onerror = function (error) {
                console.error('Worker error: ', error);
            };

            let editProductCompetitor = a.querySelectorAll(".edit-product-competitor")
            for (let i = 0; i < editProductCompetitor.length; i++) {
                editProductCompetitor[i].addEventListener('click', editProduct);
            }

            function removeElements() {
                popup.querySelector(".products-competitor").innerHTML = "";
            }   
            
            function addFavorite(e){
                let favorites = loadFromStorage(a.querySelector(".select-competitor").value);
                if(favorites == undefined) favorites = [];

                if(e.target.id == "favorite"){

                    let indice = favorites.indexOf(e.target.closest(".card-product").querySelector("#ref").innerHTML);

                    if (indice !== -1) {
                        favorites.splice(indice, 1);
                    }
                    e.target.src = "./img/favorites-white.svg"
                    e.target.id = "favorites-white"
                } 
                else {
                    favorites.push(e.target.closest(".card-product").querySelector("#ref").innerHTML)
                    e.target.src = "./img/favorites-yellow.svg"
                    e.target.id = "favorite";
                    
                }

                const allProducts = popup.querySelector(".products-competitor").querySelectorAll(".card-product");
                for (let i = 0; i < allProducts.length; i++) {
                    allProducts[i].querySelector("img").src = "./img/favorites-white.svg"
                    allProducts[i].querySelector("img").id = "favorites-white";
                    for (let j = 0; j < favorites.length; j++) {
                        if(allProducts[i].querySelector("#ref").innerHTML == favorites[j]){
                            allProducts[i].querySelector("img").src = "./img/favorites-yellow.svg"
                            allProducts[i].querySelector("img").id = "favorite";
                        }
                    }
                }

                saveToStorage(a.querySelector(".select-competitor").value,favorites);

                
                renderFavorites();
            }

            function renderFavorites(){
                let favorites = loadFromStorage(a.querySelector(".select-competitor").value);
                if(favorites == undefined) favorites = [];

                let filtres = popup.querySelectorAll(".filtre")
                let havefilter = false;
                for (let i = 0; i < filtres.length; i++) {
                    if(filtres[i].style.borderWidth == "3px"){
                        havefilter = true;
                    }
                }
                if(favorites.length == 0){
                    popup.querySelector(".hr-favorites").style.display = "none";
                }else if(!havefilter){
                    popup.querySelector(".hr-favorites").style.display = "block";
                }

                popup.querySelector(".products-favorites").innerHTML = "";
                for (let i = 0; i < favorites.length; i++) {
                    let row = 0;
                    for (let j = 0; j < references.length; j++) {
                        if((references[j].toString()) == favorites[i].toString()){
                            row = j;
                            break;
                        }
                    }
                    const element = document.createElement('div')
                    const Content = `
                    <button style="align-items: center;
                    justify-content: center;display: flex;height: 20px;width:20px;position:absolute;top:10px;right:10px;cursor:pointer;background:transparent;border:none;">
                        <img style=";height: 20px;width:20px;" id="favorite" src="./img/favorites-yellow.svg" alt="">
                    </button>
                    
                    <p id="fam" style="font-size:15px">${families[row]}</p>
                    <p id="sfam" style="font-size:10px">${subfamilies[row]}</p>
                    <h5 id="name" style="font-size: 20px;">${names[row]}</h5>
                    <p id="desc" style="font-size: 10px;">${descriptions[row]}</p>
                    <p id="pvp" style="font-size: 25px; margin-top:10px;margin-bottom:20px">${pvps[row]}¤</p>
                    <p id="ref" style="font-size: 12px;left: 10px;position:absolute; bottom:7px;">${references[row]}</p>
                    <p id="diam" style="font-size: 12px;right: 10px;position:absolute; bottom:7px;">Ø${diameters[row]}</p>
                    <p id="ean" style="display:none;">${eans[row]}</p>
                    `
                    element.classList.add("card-product")
                    element.style.height = "auto"
                    element.innerHTML = Content
                    element.querySelector("button").addEventListener('click', addFavorite)
                    popup.querySelector(".products-favorites").appendChild(element)

                    if (families[row] == undefined) {
                        element.querySelector("#fam").style.display = "none"
                    }if (subfamilies[row] == undefined) {
                        element.querySelector("#sfam").style.display = "none" //asdf f
                    }if (names[row] == undefined) {
                        element.querySelector("#name").style.display = "none"
                    }if (descriptions[row] == undefined) {
                        element.querySelector("#desc").style.display = "none"
                    }if (pvps[row] == undefined) {
                        element.querySelector("#pvp").style.display = "none"
                    }if (references[row] == undefined) {
                        element.querySelector("#ref").style.display = "none"
                    }if (diam == undefined) {
                        element.querySelector("#diam").style.display = "none"
                    }
                }
                addEventCLickProducts();
            }

            let page = 0;
            let maxpages;

            function addElements() {
                page = 0;
                popup.querySelector("#page-before").style.opacity = "50%";
                maxpages = Math.ceil(productsAdd.length/105);

                if(maxpages-1 == page || maxpages == 0){
                    popup.querySelector("#page-next").style.opacity = "50%";
                    maxpages = 1;
                }else{
                    popup.querySelector("#page-next").style.opacity = "100%";
                }

                popup.querySelector("#pages-counting").innerHTML = `${page+1}/${maxpages}`

                print();
            }

            popup.querySelector("#page-next").addEventListener("click", (event) => {
                if(maxpages-1 == page){
                    
                }else{
                    ++page;
                    popup.querySelector("#page-before").style.opacity = "100%";
                    popup.querySelector("#pages-counting").innerHTML = `${page+1}/${maxpages}`
                    print()
                    if(maxpages-1 == page){
                        popup.querySelector("#page-next").style.opacity = "50%";
                    }
                }
            });
            
            popup.querySelector("#page-before").addEventListener("click", (event) => {
                if(page == 0){
                    
                }else{
                    --page;
                    popup.querySelector("#page-next").style.opacity = "100%";
                    popup.querySelector("#pages-counting").innerHTML = `${page+1}/${maxpages}`
                    print()
                    if(page == 0){
                        popup.querySelector("#page-before").style.opacity = "50%";
                    }
                }
            });

            function print(){
                popup.querySelector("#all-products-popup").scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                if(productsAdd.length >= (page+1)*105){
                    end = (page+1)*105;
                }else{
                    end = productsAdd.length
                }
                popup.querySelector(".products-competitor").innerHTML = ""
                for (let i = page*105; i < end; i++) {
                    let row = productsAdd[i];

                    let imgFavorite = './img/favorites-white.svg'
                    let idFavorite = 'favorites-white'
                    let favorites = loadFromStorage(a.querySelector(".select-competitor").value);
                    if(favorites == undefined) favorites = [];

                    for (let k = 0; k < favorites.length; k++) {
                        if(favorites[k] == references[row]){
                            imgFavorite = './img/favorites-yellow.svg'
                            idFavorite = 'favorite'
                            break;
                        }
                    }

                    const element = document.createElement('div')
                    const Content = `
                    <button style="align-items: center;
                    justify-content: center;display: flex;height: 20px;width:20px;position:absolute;top:10px;right:10px;cursor:pointer;background:transparent;border:none;">
                        <img style=";height: 20px;width:20px;" id="${idFavorite}" src="${imgFavorite}" alt="">
                    </button>

                    <p id="fam" style="font-size:15px">${families[row]}</p>
                    <p id="sfam" style="font-size:10px">${subfamilies[row]}</p>
                    <h5 id="name" style="font-size: 20px;">${names[row]}</h5>
                    <p id="desc" style="font-size: 10px;">${descriptions[row]}</p>
                    <p id="pvp" style="font-size: 25px; margin-top:10px;margin-bottom:20px">${pvps[row]}¤</p>
                    <p id="ref" style="font-size: 12px;left: 10px;position:absolute; bottom:7px;">${references[row]}</p>
                    <p id="diam" style="font-size: 12px;right: 10px;position:absolute; bottom:7px;">Ø${diameters[row]}</p>
                    <p id="ean" style="display:none;">${eans[row]}</p>
                    `
                    element.classList.add("card-product")
                    element.style.height = "auto"
                    element.innerHTML = Content
                    element.querySelector("button").addEventListener('click', addFavorite)
                    popup.querySelector(".products-competitor").appendChild(element)

                    if (families[row] == undefined) {
                        element.querySelector("#fam").style.display = "none"
                    }if (subfamilies[row] == undefined) {
                        element.querySelector("#sfam").style.display = "none"
                    }if (names[row] == undefined) {
                        element.querySelector("#name").style.display = "none"
                    }if (descriptions[row] == undefined) {
                        element.querySelector("#desc").style.display = "none"
                    }if (pvps[row] == undefined) {
                        element.querySelector("#pvp").style.display = "none"
                    }if (references[row] == undefined) {
                        element.querySelector("#ref").style.display = "none"
                    }if (diameters[row] == undefined) {
                        element.querySelector("#diam").style.display = "none"
                    }
                }
                addEventCLickProducts();
            }

            function searchByREF(ref){
                popup.querySelector(".products-created").style.display = "none";
                popup.querySelector(".hr-created").style.display = "none";
                popup.querySelector(".products-favorites").style.display = "none";
                popup.querySelector(".hr-favorites").style.display = "none";

                const filtersDiv = popup.querySelectorAll(".filtre");
                for (let i = 0; i < filtersDiv.length; i++) {
                    filtersDiv[i].style.borderWidth = "1px";
                }

                popup.querySelector("#reference").style.borderWidth = "3px";

                if(ref == ""){
                    addFirstElements();
                }else{
                    removeElements()
                    productsAdd = [];
                    for (let i = 0; i < references.length; i++) {
                        if((references[i].toString()).startsWith(ref.toString())){
                            productsAdd.push(i)
                        }
                    }
                    addElements();
                }
                addEventCLickProducts()
            }

            function searchByEAN(ref){
                popup.querySelector(".products-created").style.display = "none";
                popup.querySelector(".hr-created").style.display = "none";
                popup.querySelector(".products-favorites").style.display = "none";
                popup.querySelector(".hr-favorites").style.display = "none";

                const filtersDiv = popup.querySelectorAll(".filtre");
                for (let i = 0; i < filtersDiv.length; i++) {
                    filtersDiv[i].style.borderWidth = "1px";
                }

                popup.querySelector("#ean").style.borderWidth = "3px";

                if(ref == ""){
                    addFirstElements();
                }else{
                    removeElements()
                    productsAdd = [];
                    for (let i = 0; i < eans.length; i++) {
                        if((eans[i].toString()).startsWith(ref.toString())){
                            productsAdd.push(i)
                        }
                    }
                    addElements();
                }
                addEventCLickProducts()
            }

            function searchByNAME(name){
                const filtersDiv = popup.querySelectorAll(".filtre");
                for (let i = 0; i < filtersDiv.length; i++) {
                    filtersDiv[i].style.borderWidth = "1px";
                }

                popup.querySelector("#name").style.borderWidth = "3px";

                popup.querySelector(".products-created").style.display = "none";
                popup.querySelector(".hr-created").style.display = "none";
                popup.querySelector(".products-favorites").style.display = "none";
                popup.querySelector(".hr-favorites").style.display = "none";
                if(name == ""){
                    addFirstElements();
                }else{
                    removeElements();
                    productsAdd = [];
                    for (let i = 0; i < names.length; i++) {
                        if((names[i].toString()).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(name.toString().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))){
                            productsAdd.push(i)
                        }
                    }
                    addElements()
                }
                addEventCLickProducts();
            }

            function searchByFILTRE(){
                removeElements();
                popup.querySelector(".products-created").style.display = "none";
                popup.querySelector(".hr-created").style.display = "none";
                popup.querySelector(".products-favorites").style.display = "none";
                popup.querySelector(".hr-favorites").style.display = "none";
                const filtersDiv = popup.querySelectorAll(".filtre");
                    for (let i = 0; i < filtersDiv.length; i++) {
                        filtersDiv[i].style.borderWidth = "1px";
                    }

                    popup.querySelector("#div-filtre").style.borderWidth = "3px";
                if(popup.querySelector("#filtre-subfamilia").value == "" && popup.querySelector("#filtre-familia").value == "" && popup.querySelector("#filtre-diametro").value == ""){
                    

                    addFirstElements();
                }
                productsAdd = [];

                let productsAddF = [];

                if(haveFamily && popup.querySelector("#filtre-familia").value != ""){                    
                    let searchedFam = popup.querySelector("#filtre-familia").value
                    for (let i = 0; i < families.length; i++) {
                        if(families[i] == searchedFam){
                            productsAddF.push(i);
                        }
                    }
                }

                if((haveDiameter || (haveInletdiameter && haveOutletdiameter)) && popup.querySelector("#filtre-diametro").value != ""){
                    let searchedDiam = popup.querySelector("#filtre-diametro").value
                    if(haveFamily && popup.querySelector("#filtre-familia").value == ""){
                        for (let i = 0; i < diameters.length; i++) {
                            if(diameters[i] == searchedDiam){
                                productsAdd.push(i)
                            }
                        }
                    }else{
                        for (let i = 0; i < productsAddF.length; i++) {
                            if(diameters[productsAddF[i]] == searchedDiam){
                                productsAdd.push(productsAddF[i])
                            }
                        }
                    }
                }else{
                    productsAdd = productsAddF;
                }


                

                addElements();
                if(productsAdd.length == 0) addFirstElements()
                /*
                if(haveFamily && haveSubfamily && popup.querySelector("#filtre-subfamilia").value != ""){
                    productsAdd = [];
                    let searchedFam = popup.querySelector("#filtre-familia").value
                    let searchedSubfam = popup.querySelector("#filtre-subfamilia").value
                    for (let i = 0; i < families.length; i++) {
                        if(families[i] == searchedFam && subfamilies[i] == searchedSubfam){
                            if(haveDiameter && popup.querySelector("#filtre-diametro").value != ""){
                                if(diameters[i] == popup.querySelector("#filtre-diametro").value){
                                    productsAdd.push(i);
                                }
                            }else{
                                productsAdd.push(i);
                            }
                        }
                    }
                    addElements();
                }else if(haveFamily && popup.querySelector("#filtre-familia").value != ""){
                    productsAdd = [];
                    let searchedFam = popup.querySelector("#filtre-familia").value
                    for (let i = 0; i < families.length; i++) {
                        if(families[i] == searchedFam){
                            if((haveInletdiameter || haveOutletdiameter || haveDiameter) && popup.querySelector("#filtre-diametro").value != ""){
                                if(diameters[i] == popup.querySelector("#filtre-diametro").value){
                                    productsAdd.push(i);
                                }
                            }else{
                                productsAdd.push(i);
                            }
                        }
                    }
                    addElements()
                }*/
                addEventCLickProducts()
            }

            function deleteFilters(){
                const filtersDiv = popup.querySelectorAll(".filtre");
                for (let i = 0; i < filtersDiv.length; i++) {
                    filtersDiv[i].style.borderWidth = "1px";
                }

                let inputDiameter = popup.querySelector("#filtre-diametro");

                inputDiameter.innerHTML = `<option value="">DIÁMETRO</option>`;

                for (let i = 0; i < diametersWithoutDuplicatesC.length; i++) {
                    const newOption = document.createElement('option');
                    newOption.value = diametersWithoutDuplicatesC[i];
                    newOption.text = `Ø${diametersWithoutDuplicatesC[i]}`;
                    inputDiameter.appendChild(newOption)
                }

                popup.querySelector(".filtre-delete").style.borderWidth = "3px";
                addFirstElements();

                let a = popup.querySelectorAll(".filtre")
                for (let i = 0; i < a.length; i++) {
                    a[i].style.borderWidth = "1px"
                }
                let inputs = popup.querySelectorAll("input")
                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].value = "";
                }
                let selects = popup.querySelectorAll("select")
                for (let i = 0; i < selects.length; i++) {
                    selects[i].value = "";
                }
            }

            function addFirstElements(){
                removeElements();
                productsAdd = [];
                popup.querySelector(".products-created").style.display = "flex";
                popup.querySelector(".hr-created").style.display = "block";

                let favorites = loadFromStorage(a.querySelector(".select-competitor").value);
                if(favorites == undefined) favorites = [];
                if(favorites.length > 0){
                    popup.querySelector(".products-favorites").style.display = "flex";
                    popup.querySelector(".hr-favorites").style.display = "block";
                }

                for (let index = 0; index < references.length; index++) {
                    productsAdd.push(index)
                }
                addElements();
                addEventCLickProducts();
            }

            function OpenPopupCreate(e){
                const Content = `<div class="popup-card" style="width: 500px;height: auto; position: relative; display: flex; justify-content: center; align-items: center;flex-direction: column; "><h3 style="position: absolute;top: 20px;left: 20px;">CREAR PRODUCTO</h3><button id="close-popup-create" onclick="closePopupCreate()" style="right: 20px;top: 20px;" class="cross"><span style="transform: translateX(-50%) rotate(45deg);" class="cross-X"></span><span style="transform: translateX(-50%) rotate(-45deg);" class="cross-Y"></span></button><div class="input-container" style="margin-top: 85px;"><input type="text" id="create-name" name="name" class="input"><label id="name-label" for="">NOMBRE</label><span>NOMBRE</span></div><div class="input-container"><textarea class="input" name="description" id="create-description" style="height: 100px;resize: vertical;overflow: auto;min-height:50px;max-height:205px;"></textarea><label id="description-label" for="">DESCRIPCIÓN</label><span>DESCRIPCIÓN</span></div><div class="input-container"><input id="create-ean" type="text" name="ean" class="input"><label for="">CÓDIGO EAN</label><span>CÓDIGO EAN</span></div><div class="input-container"><input id="create-reference" type="text" name="reference" class="input"><label for="">REFERENCIA</label><span>REFERENCIA</span></div><div class="input-container"><input id="create-family" type="text" name="family" class="input"><label for="">FAMILIA</label><span>FAMILIA</span></div><div class="input-container"><input id="create-subfamily" type="text" name="subfamily" class="input"><label for="">SUBFAMILIA</label><span>SUBFAMILIA</span></div><div class="input-container"><input id="create-diameter" type="text" name="diameter" class="input"><label for="">DIÁMETRO</label><span>DIÁMETRO</span></div><div class="input-container"><input id="create-price" type="number" name="price" class="input"><label for="">PRECIO PVP</label><span>PRECIO PVP</span></div><button id="button-create-product" style="margin: 20px;width: 80%;outline: none;border: 1px solid black;background: #ebebeb;padding: 0.6rem 1.2rem;color: #105378;font-weight: bold;font-size: 0.95rem;letter-spacing: 0.5px;border-radius: 25px;cursor: pointer;font-family: 'Gotham-title';">CREAR</button></div>`
                const popupCreate = document.createElement("div")
                popupCreate.classList.add("popup")
                popupCreate.style.zIndex = 200;
                popupCreate.style.visibility = "visible";
                popupCreate.innerHTML = Content;
                document.getElementById("page").appendChild(popupCreate)
                
                const inputs = popupCreate.querySelectorAll(".input");
                inputs.forEach((input) => {
                    input.addEventListener("focus", focusFunc);
                    input.addEventListener("blur", blurFunc);
                });

                popupCreate.querySelector("#close-popup-create").addEventListener('click', (event) => {
                    popupCreate.remove()
                });

                popupCreate.querySelector("#button-create-product").addEventListener('click', (event) => {
                    if(popupCreate.querySelector("#create-price").value == ""){
                        popupCreate.querySelector("#create-price").style.borderColor = "red";
                        popupCreate.querySelector("#create-price").style.backgroundColor = "#ff000029";
                    }else{
                        const Content = `<button id="delete-product" style="right: 5px;top: 5px;height:20px;width:20px;" class="cross"><span style="transform: translateX(-50%) rotate(45deg);width: 1em;" class="cross-X"></span><span style="transform: translateX(-50%) rotate(-45deg);width: 1em;" class="cross-Y"></span></button><p id="fam" style="font-size:15px">${popupCreate.querySelector("#create-family").value}</p><p id="sfam" style="font-size:10px">${popupCreate.querySelector("#create-subfamily").value}</p><h5 id="name" style="font-size: 20px;">${popupCreate.querySelector("#create-name").value}</h5><p id="desc" style="font-size: 10px;">${popupCreate.querySelector("#create-description").value}</p><p id="pvp" style="font-size: 25px; margin-top:10px;margin-bottom:20px">${(popupCreate.querySelector("#create-price").value)}¤</p><p id="ref" style="font-size: 12px;left: 10px;position:absolute; bottom:7px;">${popupCreate.querySelector("#create-reference").value}</p><p id="diam" style="font-size: 12px;right: 10px;position:absolute; bottom:7px;">Ø${popupCreate.querySelector("#create-diameter").value}</p><p id="ean" style="display:none;">${popupCreate.querySelector("#create-ean")}</p>`
                        const element = document.createElement("div")
                        element.classList.add("card-product")
                        element.style.height = "auto"
                        element.style.padding = "0";
                        element.innerHTML = Content
                        popup.querySelector(".products-created").appendChild(element)

                        element.querySelector("#delete-product").addEventListener('click', (event) => {
                            element.remove()
                        });

                        popupCreate.remove();
                        popup.querySelector(".card-create-product").remove(); //asdf

                        saveToStorage("productsCreated",popup.querySelector(".products-created").innerHTML)
                        
                        const ContentAdd = `<button style="background-color: #b2b2b2;position: relative;" class="cross add"><span style="transform: translateX(-52%) rotate(0deg);" class="cross-X"></span><span style="transform: translateX(-52%) rotate(90deg);" class="cross-Y"></span></button>`
                        const addElement = document.createElement("div")
                        addElement.classList.add('card-create-product')
                        addElement.innerHTML = ContentAdd;

                        popup.querySelector(".products-created").insertBefore(addElement, popup.querySelector(".products-created").firstElementChild);
                        
                        addElement.querySelector(".add").addEventListener('click', (event) => {
                            OpenPopupCreate(e);
                        });
                        addEventCLickProducts();
                    }
                });
                
            }

            function editProduct(e){
                renderFavorites();
                const y = popup.querySelector(".products-created").querySelectorAll(".card-product")

                for (let i = 0; i < y.length; i++) {
                    y[i].remove()
                }
                let storage = loadFromStorage("productsCreated");
                if(storage == undefined) storage = "";
                popup.querySelector(".products-created").innerHTML += storage;

                const productsStoraged = popup.querySelector(".products-created").querySelectorAll(".card-product");

                for (let i = 0; i < productsStoraged.length; i++) {

                    productsStoraged[i].querySelector("#delete-product").addEventListener("click", (event) => {
                        productsStoraged[i].remove()
                        popup.querySelector(".products-created").querySelector(".card-create-product").style.display = "none";
                        saveToStorage("productsCreated",popup.querySelector(".products-created").innerHTML)
                        popup.querySelector(".products-created").querySelector(".card-create-product").style.display = "flex";
                    });
                }
                
                popup.style.visibility = "visible";

                popup.querySelector(".add").addEventListener('click', (event) => {
                    OpenPopupCreate(e);
                });

                productEdit = e.target
                addEventCLickProducts();
            }

            function loadPrice(){

                let netpriceBofill;
                let quantity;
                let allProducts = a.querySelector(".products-container").querySelectorAll(".product-card")
                const discount = a.querySelector(".input-discount").value
                for (let i = 0; i < allProducts.length; i++) {
                    const unitpricePvp = parseFloat(allProducts[i].querySelector(".ppu-product").innerHTML.substring(0, allProducts[i].querySelector(".ppu-product").innerHTML.length - 3).replace(/\./g, '').replace(/,/g, '.'))
                    const unitpriceNet = unitpricePvp*(100-discount)/100;
                    let productsBofill = document.getElementById("Bofill").querySelectorAll(".product-card")
                    for (let j = 0; j < productsBofill.length; j++) {
                        if(productsBofill[j].id == allProducts[i].id){
                            quantity = parseInt(productsBofill[j].querySelector(".quantity-product").value)
                            netpriceBofill = parseFloat(productsBofill[j].querySelector(".netprice-product").innerHTML.slice(0, -1).replace(/\./g, '').replace(/,/g, '.'))
                        }
                    }
                    let difAbs = (unitpriceNet*quantity - netpriceBofill);
                    let difPer = difAbs/(netpriceBofill)*100
                    allProducts[i].querySelector(".pvp-product").innerHTML = `${isNaN(unitpricePvp*quantity) ? "XX,XX" : (unitpricePvp*quantity).toLocaleString('es-ES', numberOptionsEU)}¤`
                    allProducts[i].querySelector(".ppu-netprice-product").innerHTML = `${isNaN(unitpriceNet) ? "XX,XX" : unitpriceNet.toLocaleString('es-ES', numberOptionsEU)}¤/u`
                    allProducts[i].querySelector(".netprice-product").innerHTML = `${isNaN(unitpriceNet*quantity) ? "XX,XX" : (unitpriceNet*quantity).toLocaleString('es-ES', numberOptionsEU)}¤`
                    
                    if(difAbs >= 0 || isNaN(difAbs)){
                        allProducts[i].querySelector(".difference-absolute").innerHTML = `+${isNaN(difAbs) ? "XX,XX" : difAbs.toLocaleString('es-ES', numberOptionsEU1)}¤`;
                        allProducts[i].querySelector(".difference-absolute").style.color = '#980a0a';
                        allProducts[i].querySelector(".difference-percentatge").innerHTML = `+${isNaN(difPer) ? "XX,XX" : difPer.toLocaleString('es-ES', numberOptionsEU1)}%`;
                        allProducts[i].querySelector(".difference-percentatge").style.color = '#980a0a';
                    }else{
                        allProducts[i].querySelector(".difference-absolute").innerHTML = `${isNaN(difAbs) ? "XX,XX" : difAbs.toLocaleString('es-ES', numberOptionsEU1)}¤`;
                        allProducts[i].querySelector(".difference-absolute").style.color = 'rgb(15, 137, 12)';
                        allProducts[i].querySelector(".difference-percentatge").innerHTML = `${isNaN(difPer) ? "XX,XX" : difPer.toLocaleString('es-ES', numberOptionsEU1)}%`;
                        allProducts[i].querySelector(".difference-percentatge").style.color = 'rgb(15, 137, 12)';
                    }
                }
                loadTotal();
            }

            function loadTotal(){
                let allProducts = a.querySelectorAll('.product-card')
                var totalPvpPrice = 0.0;
                var totalNetPrice = 0.0; 
                for (let i = 0; i < allProducts.length; i++) { 
                    totalPvpPrice += parseFloat(allProducts[i].querySelector('#price').innerHTML.slice(0, -1).replace(/\./g, '').replace(/,/g, '.'));
                    totalNetPrice += parseFloat(allProducts[i].querySelector('#netprice').innerHTML.slice(0, -1).replace(/\./g, '').replace(/,/g, '.'));
                }
                a.querySelector("#total-pvpprice").innerHTML = `${isNaN(totalPvpPrice) ? "XX,XX" : totalPvpPrice.toLocaleString('es-ES', numberOptionsEU)}¤`
                a.querySelector("#total-netprice").innerHTML = `${isNaN(totalNetPrice) ? "XX,XX" : totalNetPrice.toLocaleString('es-ES', numberOptionsEU)}¤`
                netpriceBofill = parseFloat(document.getElementById("Bofill").querySelector("#total-netprice").innerHTML.slice(0, -1).replace(/\./g, '').replace(/,/g, '.'))
                let difAbs = totalNetPrice - netpriceBofill;
                let difPer = difAbs/(netpriceBofill)*100;
                if(difAbs >= 0 || isNaN(difAbs)){
                    a.querySelector("#netprice-difference-absolute").innerHTML = `+${isNaN(difAbs) ? "XX,X" : difAbs.toLocaleString('es-ES', numberOptionsEU1)}¤`
                    a.querySelector("#netprice-difference-absolute").style.color = "#980a0a"
                    a.querySelector("#netprice-difference-percentatge").innerHTML = `+${isNaN(difPer) ? "XX,X" : difPer.toLocaleString('es-ES', numberOptionsEU1)}%`
                    a.querySelector("#netprice-difference-percentatge").style.color = "#980a0a"
                }else{
                    a.querySelector("#netprice-difference-absolute").innerHTML = `${isNaN(difAbs) ? "XX,X" : difAbs.toLocaleString('es-ES', numberOptionsEU1)}¤`
                    a.querySelector("#netprice-difference-absolute").style.color = "rgb(15, 137, 12)"
                    a.querySelector("#netprice-difference-percentatge").innerHTML = `${isNaN(difPer) ? "XX,X" : difPer.toLocaleString('es-ES', numberOptionsEU1)}%`
                    a.querySelector("#netprice-difference-percentatge").style.color = "rgb(15, 137, 12)"
                }
                pvppriceBofill = parseFloat(document.getElementById("Bofill").querySelector("#total-pvpprice").innerHTML.slice(0, -1).replace(/\./g, '').replace(/,/g, '.'))
                difAbs = totalPvpPrice - pvppriceBofill;
                difPer = difAbs/(pvppriceBofill)*100;

                if(difAbs >= 0 || isNaN(difAbs)){
                    a.querySelector("#pvp-difference-absolute").innerHTML = `+${isNaN(difAbs) ? "XX,X" : difAbs.toLocaleString('es-ES', numberOptionsEU1)}¤`
                    a.querySelector("#pvp-difference-absolute").style.color = "#980a0a"
                    a.querySelector("#pvp-difference-percentatge").innerHTML = `+${isNaN(difPer) ? "XX,X" : difPer.toLocaleString('es-ES', numberOptionsEU1)}%`
                    a.querySelector("#pvp-difference-percentatge").style.color = "#980a0a"
                }else{
                    a.querySelector("#pvp-difference-absolute").innerHTML = `${isNaN(difAbs) ? "XX,X" : difAbs.toLocaleString('es-ES', numberOptionsEU1)}¤`
                    a.querySelector("#pvp-difference-absolute").style.color = "rgb(15, 137, 12)"
                    a.querySelector("#pvp-difference-percentatge").innerHTML = `${isNaN(difPer) ? "XX,X" : difPer.toLocaleString('es-ES', numberOptionsEU1)}%`
                    a.querySelector("#pvp-difference-percentatge").style.color = "rgb(15, 137, 12)"
                }
                
            }

            function addEventCLickProducts(){
                let allProducts = popup.querySelectorAll(".card-product")
                
                for (let i = 0; i < allProducts.length; i++) {
                    allProducts[i].addEventListener('click', (event) => {
                        if(event.target.tagName != 'SPAN' && event.target.tagName != 'BUTTON' && event.target.tagName != 'IMG'){
                            productEdit.closest(".product-card").querySelector(".name-product").innerHTML = allProducts[i].querySelector("#name").innerHTML || "";
                        productEdit.closest(".product-card").querySelector(".fam-product").innerHTML = allProducts[i].querySelector("#fam").innerHTML || "";
                        productEdit.closest(".product-card").querySelector(".ref-product").innerHTML = allProducts[i].querySelector("#ref").innerHTML || "";

                        let price = parseFloat(allProducts[i].querySelector("#pvp").innerHTML.slice(0, -1).toLocaleString('en-EN', numberOptionsEN));
                        let netprice = price*(100-discount.value)/100;
                        let quantity;
                        let netpriceBofill;
                        let difAbs;
                        let difPer;
                        const productes = document.getElementById("Bofill").querySelectorAll(".product-card")
                        for (let i = 0; i < productes.length; i++) {
                            if(productes[i].id == productEdit.closest(".product-card").id){
                                productes[i].querySelector(".quantity-product").addEventListener('input', (event) => {
                                    loadPrice();
                                });
                                productes[i].querySelector(".cross").addEventListener('click', (event) => {
                                    loadPrice();
                                });
                            }
                        }
                        productEdit.closest(".product-card").querySelector(".ppu-product").innerHTML = `${price.toLocaleString('es-ES', numberOptionsEU)}¤/u`
                        discount.addEventListener('input', (event) => {
                            loadPrice();
                        });

                        document.getElementById('discount-bofill').addEventListener('input', (event) => {
                            loadPrice();
                        });

                        loadPrice();

                        if(productEdit.closest(".product-card").querySelector(".name-product").clientHeight >= 80 || productEdit.closest(".product-card").querySelector(".name-product").clientWidth >= 200){
                            productEdit.closest(".product-card").querySelector(".name-product").style.fontSize = "15px";
                        }
                        if(productEdit.closest(".product-card").querySelector(".name-product").clientWidth >= 400){
                            productEdit.closest(".product-card").querySelector(".name-product").style.fontSize = "12px";
                        }

                        popup.style.visibility = "hidden";
                        }
                    });
                }
            }

            document.getElementById("button-add-product").addEventListener("click", (event) => {
                addProductCompetitor("add")
            });

            document.getElementById("closePopupBofill").addEventListener("click", (event) => {
                let productCard = a.querySelectorAll(".product-card")
                productCard[productCard.length - 1].remove()
            });

            function addProductCompetitor(name){
                card_product = document.createElement("div")
                card_product.classList.add("product-card")
                if(name == "add"){
                    card_product.setAttribute('id',`product-${id_product}`);
                }else{
                    card_product.setAttribute('id',`${name}`);
                }
                const ContentProduct = `<div style="height: 100%;width: auto; align-items: center; display: flex;margin-left:10px; max-width:calc(100% - 320px); overflow-x:hidden;"><div><h5 class="fam-product">FAMILIA</h5><h4 class="name-product">NOMBRE</h4><p class="ref-product">CÓDIGO</p></div></div><button class="edit-product-competitor"><img loading="lazy" src="./img/edit.svg" style="height: 30px; width: 30px;" onerror="this.onerror=null; this.src='https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg';" alt=""></button><div style="width: 70px;position: absolute;right: 10px;bottom:19px;display:flex;justify-content:center;flex-direction:column;align-items:center;"><h4 id="" style="font-size:15px;color:#980a0a;" class="difference-percentatge">+XX,X%</h4><h4 id="" style="font-size:15px;color:#980a0a;" class="difference-absolute">+XX,X¤</h4></div><div style="height: 120px;width: 150px;position: absolute;right: 80px;"><h4 id="price" class="pvp-product">XX.XX¤</h4><p id="price-unit" class="ppu-product">XX.XX¤/u</p><h4 id="netprice" class="netprice-product">XX.XX¤</h4><p id="price-unit-netprice" style="right:27px" class="ppu-netprice-product">XX.XX¤/u</p></div><div style="height: 120px;width: 35px;position: absolute;right: 230px;"><p id="price-unit" class="ppu-product" style="left: 0px;top: 30px;">PVP:</p><p id="price-unit-netprice" style="left: 0px;bottom: 23px;" class="ppu-netprice-product">NETO:</p></div>`
                card_product.addEventListener('mouseover', changeColor);
                card_product.addEventListener('mouseout', changeColor);
                card_product.innerHTML = ContentProduct;
                a.querySelector(".products-container").append(card_product)
                card_product.querySelector(".edit-product-competitor").addEventListener("click", editProduct)
                loadPrice();
            }

            if(putFirstProducts){
                const products = document.getElementById("Bofill").querySelectorAll(".product-card")
                for (let i = 0; i < products.length; i++) {
                    addProductCompetitor(products[i].id)
                }
            }
        })
        .catch(error => {
            console.error('Error al leer el archivo:', error);
            doError(`NO S'HA TROBAT EXCEL DE ${a.querySelector(".select-competitor").value.toUpperCase()}`);
        });

    adjustSelectWidth()
}

function closePopupCreate(){
    document.getElementById("popup-create-product").remove()
    newPopup = document.createElement("div")
    newPopup.setAttribute("id","popup-create-product")
    newPopup.classList.add("popup")
    const Content = `
            <div class="popup-card" style="width: 500px;height: 400px; position: relative; display: flex; justify-content: center; align-items: center;flex-direction: column; ">
                <h3 style="position: absolute;top: 20px;left: 20px;">CREAR PRODUCTO</h3>
                <button id="close-popup-create" onclick="closePopupCreate()" style="right: 20px;top: 20px;" class="cross">
                    <span style="transform: translateX(-50%) rotate(45deg);" class="cross-X"></span>
                    <span style="transform: translateX(-50%) rotate(-45deg);" class="cross-Y"></span>
                </button>

                    <div class="input-container" style="margin-top: 60px;">
                        <input type="text" id="create-name" name="name" class="input">
                        <label id="name-label" for="">NOMBRE</label>
                        <span>NOMBRE</span>
                    </div>
                    <div class="input-container">
                        <input id="create-family" type="text" name="family" class="input">
                        <label for="">FAMILIA</label>
                        <span>FAMILIA</span>
                    </div>
                    <div class="input-container">
                        <input id="create-code" type="text" name="code" class="input">
                        <label for="">CÓDIGO</label>
                        <span>CÓDIGO</span>
                    </div>
                    <div class="input-container">
                        <input id="create-price" type="number" name="price" class="input">
                        <label for="">PRECIO PVP</label>
                        <span>PRECIO PVP</span>
                    </div>

                <button id="button-create-product" style="margin: 10px;
                width: 80%;
                outline: none;
                border: 1px solid black;
                background: #ebebeb;
                padding: 0.6rem 1.2rem;
                color: #105378;
                font-weight: bold;font-size: 0.95rem;letter-spacing: 0.5px;border-radius: 25px;cursor: pointer;">
                    CREAR
                </button>
            </div>
        `
        newPopup.innerHTML = Content
    document.getElementById("page").appendChild(newPopup);
    newPopup.style.zIndex = "200";
}

function adjustSelectWidth() {
    const selectElement = document.querySelectorAll('.select-competitor')
    for (let i = 0; i < selectElement.length; i++) {
        const optionText = selectElement[i].options[selectElement[i].selectedIndex].text;
    
        const tempElement = document.createElement('span');
        tempElement.style.visibility = 'hidden';
        tempElement.style.position = 'absolute';
        tempElement.style.fontSize = '1.17em';
        tempElement.style.fontWeight = 'bold';
        tempElement.style.whiteSpace = 'nowrap';
        tempElement.innerHTML = optionText;
           
        document.body.appendChild(tempElement);
           
        const tempWidth = tempElement.offsetWidth;
        document.body.removeChild(tempElement);
           
        selectElement[i].style.width = `${tempWidth + 25}px`; 
    }
}

function focusFunc() {
    let parent = this.parentNode;
    parent.classList.add("focus");
}
  
function blurFunc() {
    let parent = this.parentNode;
    if (this.value == "") {
        parent.classList.remove("focus");
    }
}



function saveWindow(){
    let windowsBefore = loadFromStorage("windows")
    if(windowsBefore == undefined) windowsBefore = [];
    let arrayCompetitors = [];
    let cardCompetitors = document.querySelectorAll(".card-container")
    for (let i = 0; i < cardCompetitors.length; i++) {
        if(cardCompetitors[i].id != "Bofill"){
            let competitorName = cardCompetitors[i].querySelector(".select-competitor").value
            let competitorContent = cardCompetitors[i].querySelector(".products-container").innerHTML
            let competitorDiscount = cardCompetitors[i].querySelector(".input-discount").value

            arrayCompetitors.push({name: competitorName, content: competitorContent, discount: competitorDiscount})
        }
    }
    for (let i = 0; i < windowsBefore.length; i++) {
        if(windowsBefore[i].date == windowDateCreated){
            windowsBefore.splice(i,1);
        }
    }
    let discountBofill = document.querySelector("#discount-bofill").value
    let contentBofill = document.querySelector("#Bofill").querySelector(".products-container").innerHTML
    if(windowName != ""){
        windowsBefore.unshift({date: windowDateCreated, name: windowName, id_product: (id_product+1), bofill:{discount: discountBofill, content: contentBofill}, competitors:arrayCompetitors})
        saveToStorage("windows", windowsBefore)
    }
}

function cleanWindow(){
    let allWindows = this.document.querySelectorAll(".windows-input")
    for (let i = 0; i < allWindows.length; i++) {
        allWindows[i].style.backgroundColor = "white";
        allWindows[i].closest("div").querySelector(".cross").style.display = "none";
        allWindows[i].closest("div").querySelector(".edit-name-window").style.right = "1px";
    }
    document.querySelector("#Bofill").querySelector(".products-container").innerHTML = "";
    let cardContainer = this.document.querySelectorAll(".card-container")
    for (let j = 0; j < cardContainer.length; j++) {
        if(cardContainer[j].id != "Bofill"){
            cardContainer[j].remove();
        }
    }
    this.document.querySelector(".comparar-mes").style.display = "flex";
    this.document.querySelector("#discount-bofill").value = 0;
    this.document.querySelector("#total-pvpprice").innerHTML = "XX.XX¤";
    this.document.querySelector("#total-netprice").innerHTML = "XX.XX¤";
}

const measureSpan = document.createElement('span');
measureSpan.style.visibility = 'hidden';
measureSpan.style.position = 'absolute';
measureSpan.style.whiteSpace = 'pre';
measureSpan.style.fontSize = '1.17em'
measureSpan.style.fontFamily = 'Gotham-title'
document.body.appendChild(measureSpan);

function editNameWindow(e){
    e.target.closest("div").querySelector("input").value = "";
    e.target.closest("div").querySelector("input").focus()
    e.target.closest("div").querySelector("input").placeholder = "Título..."
    e.target.closest("div").querySelector("input").style.width = "120px"
    if(window.getComputedStyle(e.target.closest("div").querySelector(".cross")).display != "none") e.target.closest("div").querySelector("input").style.width = "150px"
}

function focusWindow(e){
    e.target.closest("div").querySelector(".cross").style.display = "block"
    e.target.closest("div").querySelector(".edit-name-window").style.right = "30px"
}

function adjustWidth(e) {
    windowName = e.value
    measureSpan.textContent = e.value || e.placeholder || '';
    let more = 44;
    if(window.getComputedStyle(e.closest("div").querySelector(".cross")).display != "none") more = 75;
    const width = measureSpan.offsetWidth + more;
    e.style.width = `${width}px`;
}

let competitorsJSON;
fetch('./config.json')
        .then((response) => response.json())
        .then((config) => {
            const files = Object.entries(config);
            competitors = files
            competitorsJSON = config
            console.log(competitorsJSON["bofill"].startingRow)
    });

window.addEventListener("load", function () {
    
    document.body.style.cursor = 'wait';


    

    fetch('../filters.json')
        .then((response) => response.json())
        .then((f) => {
            filtersJSON = f
    });

    
    const fileUrl = '../bofill.xlsx';

fetch(fileUrl)
    .then(response => response.arrayBuffer())
    .then(data => {
        renderWindows();
        document.getElementById("div-referencia").addEventListener("mosuedown", searchByREF)

        const popup = this.document.getElementById("popup");
        
        let products = [];
        let diametersWithoutDuplicatesC = [];
        console.log(competitorsJSON["bofill"].startingRow)
        const worker = new Worker('./scripts/worker.js');
            worker.postMessage({
                data:data,
                startingRow: competitorsJSON["bofill"].startingRow,
                columnImage: competitorsJSON["bofill"].imgName,
                columnName: competitorsJSON["bofill"].name,
                columnDescription: competitorsJSON["bofill"].description,
                columnEanCode: competitorsJSON["bofill"].eanCode,
                columnReference: competitorsJSON["bofill"].reference,
                columnPvp: competitorsJSON["bofill"].pvp,
                columnFamily: competitorsJSON["bofill"].family,
                columnSubfamily: competitorsJSON["bofill"].subfamily,
                columnDiameter: competitorsJSON["bofill"].diameter,
                columnInletDiameter: competitorsJSON["bofill"].inletDiameter,
                columnOutletDiameter: competitorsJSON["bofill"].outletDiameter,
                columnAdditionalFamily1: competitorsJSON["bofill"].additionalFamily1,
                columnAdditionalFamily2: competitorsJSON["bofill"].additionalFamily2,
                columnAdditionalFamily3: competitorsJSON["bofill"].additionalFamily3,
                columnAdditionalFamily4: competitorsJSON["bofill"].additionalFamily4,
                columnAdditionalFamily5: competitorsJSON["bofill"].additionalFamily5,
            });
            worker.onmessage = function (e) {
                diameters = e.data.diameters
                products = e.data.products
                console.log(products)
                const arrayDiam = Array.from(new Set(diameters))
                const numbers = arrayDiam.filter(item => typeof item === 'number');
                const strings = arrayDiam.filter(item => typeof item === 'string');
                numbers.sort((a, b) => a - b);
                strings.sort();
                diametersWithoutDuplicatesC = [...numbers, ...strings];
                let inputDiameter = popup.querySelector("#filtre-diametro");
                inputDiameter.innerHTML = `<option value="">DIÁMETRO</option>`;
                for (let i = 0; i < diametersWithoutDuplicatesC.length; i++) {
                    const newOption = document.createElement('option');
                    newOption.value = diametersWithoutDuplicatesC[i];
                    newOption.text = `Ø${diametersWithoutDuplicatesC[i]}`;
                    inputDiameter.appendChild(newOption)
                }
                addFirstElements();
                document.body.style.cursor = 'default';
                document.getElementById("Bofill").querySelector(".loader").style.display = "none";
                renderWindows();
                renderFavorites();
            };
            worker.onerror = function (error) {
                console.error('Worker error: ', error);
            };

        document.getElementById("filtre-categoria").addEventListener("change", getCategoria)
        document.getElementById("filtre-familia").addEventListener("change", getFamilia)
        //document.getElementById("filtre-subfamilia").addEventListener("change", getSubfamilia)
        //document.getElementById("filtre-diametro").addEventListener("change", getDiametro)

        
        let productsAdd = []
        let maxpages = 0;
        let page = 0;
        
        function print(){
            popup.querySelector(".products").innerHTML = "";
            popup.querySelector("#all-products-popup").scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            if(productsAdd.length >= (page+1)*105){
                end = (page+1)*105;
            }else{
                end = productsAdd.length
            }
            for (let i = page*105; i < end; i++) {
                let row = productsAdd[i]

                let favorites = loadFromStorage("bofill")
                if(favorites == undefined) favorites = [];

                const cellContentIMAGE = products[row].namefam;
                const cellContentNAME = products[row].name;
                const cellContentDESC = products[row].description;
                const cellContentREF = products[row].reference;
                const cellContentFAM = products[row].family
                const cellContentSFAM = products[row].subfamily;
                const cellContentPVP = products[row].pvp
                const cellContentEAN = products[row].ean
                const cellContentDIAMETER = products[row].diameter

                let imgFavorite = "./img/favorites-white.svg";
                let idFavorite = "favorites-white";
                for (let i = 0; i < favorites.length; i++) {
                    if(favorites[i] == cellContentREF){
                        imgFavorite = "./img/favorites-yellow.svg";
                        idFavorite = "favorite";
                    }
                }

                const element = document.createElement('div')
                const Content = `
                <button id="favorites-white" style="align-items: center; justify-content: center;display: flex;height: 20px;width:20px;position:absolute;top:10px;right:10px;cursor:pointer;background:transparent;border:none;"> <img style=";height: 20px;width:20px;" id="${idFavorite}" src="${imgFavorite}" alt=""> </button>
                <img loading="lazy" id="img" src="./img/${cellContentFAM}/${cellContentIMAGE}.png" onerror="this.onerror=null; this.src='https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg';" alt="">
                <h5 id="name" style="font-size: 20px;white-space: nowrap;">${cellContentNAME}</h5>
                <p id="desc" style="font-size: 10px;margin-bottom: 20px;">${cellContentDESC}</p>
                <p id="ref" style="font-size: 10px;left: 10px;position:absolute; bottom:7px;">${cellContentREF}</p>
                <p id="diam" style="font-size: 10px;right: 10px;position:absolute; bottom:7px;">Ø${cellContentDIAMETER}</p>
                <p id="namefam" style="display:none;">${cellContentIMAGE}</p>
                <p id="fam" style="display:none;">${cellContentFAM}</p>
                <p id="sfam" style="display:none;">${cellContentSFAM}</p>
                <p id="pvp" style="display:none;">${cellContentPVP}</p>
                <p id="ean" style="display:none;">${cellContentEAN}</p>
                `
                element.classList.add("card-product")
                element.innerHTML = Content
                element.querySelector("button").addEventListener('click', addFavorite)
                element.addEventListener("click", addProduct);
                document.getElementById("products").appendChild(element)
            }
        }

        function addElements(products) {
            page = 0;
            
            maxpages = Math.ceil(products.length/105);

            if(maxpages-1 == page || maxpages == 0){
                popup.querySelector("#page-next").style.opacity = "50%";
                maxpages = 1;
            }else{
                popup.querySelector("#page-next").style.opacity = "100%";
            }

            popup.querySelector("#pages-counting").innerHTML = `${page+1}/${maxpages}`

            print()

            popup.querySelector("#page-before").style.opacity = "50%";
            
            
        }

        popup.querySelector("#page-next").addEventListener("click", (event) => {
            if(maxpages-1 == page || maxpages == 0){
                
            }else{
                ++page;
                popup.querySelector("#page-before").style.opacity = "100%";
                popup.querySelector("#pages-counting").innerHTML = `${page+1}/${maxpages}`
                print()
                if(maxpages-1 == page){
                    popup.querySelector("#page-next").style.opacity = "50%";
                }
            }
        });
        
        popup.querySelector("#page-before").addEventListener("click", (event) => {
            if(page == 0){
                
            }else{
                --page;
                popup.querySelector("#page-next").style.opacity = "100%";
                popup.querySelector("#pages-counting").innerHTML = `${page+1}/${maxpages}`
                print()
                if(page == 0){
                    popup.querySelector("#page-before").style.opacity = "50%";
                }
            }
        });

        let favorites = loadFromStorage("bofill")
        if(favorites == undefined) favorites = []
        if(favorites.length == 0) popup.querySelector("hr").style.display = "none"

        function searchByREF(ref){
            popup.querySelector("hr").style.display = "none";
            popup.querySelector(".products-favorites").style.display = "none";
            if(ref == ""){
                addFirstElements();
                return;
            }
            productsAdd = []
            for (let i = 0; i < products.length; i++) {
                if((products[i].reference.toString()).startsWith(ref.toString())){
                    productsAdd.push(i)
                }
            }
            addElements(productsAdd)
        }

        function searchByEAN(code){
            popup.querySelector("hr").style.display = "none";
            popup.querySelector(".products-favorites").style.display = "none";
            if(code == ""){
                addFirstElements();
                return;
            }
            productsAdd = []
            for (let i = 0; i < products.length; i++) {
                if((products[i].ean.toString()).startsWith(code.toString())){
                    productsAdd.push(i)
                }
            }
            addElements(productsAdd)
        }

        function searchByNAME(name){
            popup.querySelector("hr").style.display = "none";
            popup.querySelector(".products-favorites").style.display = "none";
            if(name == ""){
                addFirstElements();
                return;
            }
            productsAdd = []
            for (let i = 0; i < products.length; i++) {
                if((products[i].name.toString()).startsWith(name.toString().toUpperCase())){
                    productsAdd.push(i)
                }
            }
            addElements(productsAdd)
        }

        function searchByFILTRE(){
            popup.querySelector("hr").style.display = "none";
            popup.querySelector(".products-favorites").style.display = "none";
            let category = document.getElementById('filtre-categoria')
            let family = document.getElementById('filtre-familia')
            let subfamily = document.getElementById('filtre-subfamilia')
            let diameter = document.getElementById('filtre-diametro')
            productsAdd = [];
            if(subfamily.value != ""){
                removeElements()
                let famShow = family.value
                let subfamsShow = subfamily.value;

                for (let i = 0; i < products.length; i++) {
                    if(products[i].family == famShow || products[i].additionalFamily1 == famShow || products[i].additionalFamily2 == famShow || products[i].additionalFamily3 == famShow || products[i].additionalFamily4 == famShow || products[i].additionalFamily5 == famShow){
                        if(products[i].subfamily.toUpperCase() == subfamsShow.toUpperCase()){
                            productsAdd.push(i);
                        }
                    }
                }
            }else if(family.value != ""){
                removeElements()
                let famShow = family.value
                for (let i = 0; i < products.length; i++) {
                    if(products[i].family == famShow || products[i].additionalFamily1 == famShow || products[i].additionalFamily2 == famShow || products[i].additionalFamily3 == famShow || products[i].additionalFamily4 == famShow || products[i].additionalFamily5 == famShow){
                        productsAdd.push(i)
                    }
                }
            }else if(category.value != ""){
                removeElements()
                let famsShow = filtersJSON[category.value];
                for (let i = 0; i < products.length; i++) {
                    for (let j = 0; j < famsShow.length; j++) {
                        if(products[i].family == famsShow[j] || products[i].additionalFamily1 == famsShow[j] || products[i].additionalFamily2 == famsShow[j] || products[i].additionalFamily3 == famsShow[j] || products[i].additionalFamily4 == famsShow[j] || products[i].additionalFamily5 == famsShow[j]){
                            if(!productsAdd.includes(i)){
                                productsAdd.push(i)
                            }
                        }
                    }
                }
            }else if(diameter.value == ""){
                addFirstElements();
                return;
            }

            if(diameter.value != "" && productsAdd.length != 0){
                for (let k = productsAdd.length-1; k >=0 ; k--) {   
                    if(products[productsAdd[k]].diameter != diameter.value){
                        productsAdd.splice(k, 1);
                    }
                }
            }else if(diameter.value != "" && productsAdd.length == 0){
                productsAdd = [];
                for (let k = 0; k < products.length; k++) {
                    if(products[k].diameter == diameter.value){
                        productsAdd.push(k)
                    }
                }
            }
            addElements(productsAdd);
        }

        function getCategoria(){
            let category = document.getElementById('filtre-categoria')
            let family = document.getElementById('filtre-familia')
            let subfamily = document.getElementById('filtre-subfamilia')

            subfamily.innerHTML = "";
            const newOptionSubfamily = document.createElement('option');
            newOptionSubfamily.value = "";
            newOptionSubfamily.text = "SUBFAMILIA";
            newOptionSubfamily.disabled = true;
            newOptionSubfamily.selected = true;
            subfamily.appendChild(newOptionSubfamily)

            family.innerHTML = "";
            const newOptionFamily = document.createElement('option');
            newOptionFamily.value = "";
            newOptionFamily.text = "FAMILIA";
            newOptionFamily.disabled = true;
            newOptionFamily.selected = true;
            family.appendChild(newOptionFamily)

            let categoryFamilies = filtersJSON[category.value];

            for (let j = 0; j < categoryFamilies.length; j++) {
                const newOption = document.createElement('option');
                newOption.value = categoryFamilies[j];
                newOption.text = categoryFamilies[j];
                family.appendChild(newOption)
            }
        }

        function getFamilia(){
            let family = document.getElementById('filtre-familia')
            let subfamily = document.getElementById('filtre-subfamilia')
            let diameter = document.getElementById('filtre-diametro')
            let famShow = family.value

            let subfamiliesRepetits = [];
            let diametresRepetits = [];

            for (let i = 0; i < products.length; i++) {
                if(products[i].family == famShow || products[i].additionalFamily1 == famShow || products[i].additionalFamily2 == famShow || products[i].additionalFamily3 == famShow || products[i].additionalFamily4 == famShow || products[i].additionalFamily5 == famShow){
                    subfamiliesRepetits.push(products[i].subfamily)
                    diametresRepetits.push(products[i].diameter)
                }
            }
            const subfamiliesToShow = [...new Set(subfamiliesRepetits)];

            const diametersToShow = [...new Set(diametresRepetits)];

            subfamily.innerHTML = ""
            diameter.innerHTML = ""
            const newOption = document.createElement('option');
            const newOptionD = document.createElement('option');
            newOption.value = "";
            newOptionD.value = "";
            newOption.text = "SUBFAMILIA";
            newOptionD.text = "DIÁMETRO";
            newOption.disabled = true;
            newOption.selected = true;
            newOptionD.selected = true;
            subfamily.appendChild(newOption)
            diameter.appendChild(newOptionD)

            for (let k = 0; k < subfamiliesToShow.length; k++) {
                const newOption = document.createElement('option');
                const newOptionD = document.createElement('option');
                newOption.value = subfamiliesToShow[k].toUpperCase();
                newOptionD.value = diametersToShow[k]
                newOption.text = subfamiliesToShow[k].toUpperCase();
                newOptionD.text = `Ø${diametersToShow[k]}`;
                subfamily.appendChild(newOption)
                diameter.appendChild(newOptionD)
            }
        }

        function addFirstElements(){
            popup.querySelector("hr").style.display = "block";
            popup.querySelector(".products-favorites").style.display = "flex";

            removeElements()
            let index = 0;
            productsAdd = []
            while(index < products.length){
                productsAdd.push(index)
                ++index;
            }
            addElements(productsAdd)
        }

        function removeElements() {
            document.getElementById("popup").querySelector("#products").innerHTML = "";
        }

        function deleteFilters(){
            removeElements();
            addFirstElements();
            let a = document.querySelectorAll(".filtre")
            for (let i = 0; i < a.length; i++) {
                a[i].style.borderWidth = "1px"
            }
            document.getElementById("filtre-categoria").value = "";
            document.getElementById("filtre-familia").innerHTML = `<option value="" disabled="">FAMILIA</option>`
            document.getElementById("filtre-familia").value = "";
            document.getElementById("filtre-subfamilia").innerHTML = `<option value="" disabled="">SUBFAMILIA</option>`
            document.getElementById("filtre-subfamilia").value = "";
            let inputDiameter = popup.querySelector("#filtre-diametro");
                inputDiameter.innerHTML = `<option value="">DIÁMETRO</option>`;
                for (let i = 0; i < diametersWithoutDuplicatesC.length; i++) {
                    const newOption = document.createElement('option');
                    newOption.value = diametersWithoutDuplicatesC[i];
                    newOption.text = `Ø${diametersWithoutDuplicatesC[i]}`;
                    inputDiameter.appendChild(newOption)
                }
            document.getElementById("filtre-diametro").value = "";
            document.getElementById("referencia").value = "";
            document.getElementById("nombre").value = "";
            document.getElementById("codigoean").value = "";
        }

        function addProduct(e){
            if(e.target.id != "favorite" && e.target.id != "favorites-white"){
                if(windowName == ""){
                    windowName = windowDateCreated;
                    saveWindow();
                    renderWindows();
                }
                closePopup()
            const input = e.target
            const card = input.closest(".card-product")
            const name = card.querySelector("#name").innerHTML
            const ref = card.querySelector("#ref").innerHTML
            const fam = card.querySelector("#fam").innerHTML
            const nameFam = card.querySelector("#namefam").innerHTML
            const pvp = parseFloat(card.querySelector("#pvp").innerHTML)
            const np = (pvp*(100-document.getElementById("discount-bofill").value)/100)
            const diam = card.querySelector("#diam").innerHTML.substring(1);
            const bofill = document.querySelector("#Bofill")
            const parent = bofill.querySelector(".products-container")
            const imgSRC = card.querySelector("#img").src
            
            const id_sel = `select-${id_product}`
            const id_quantity = `price-${id_product}`
            let caracter = name[name.length - 6];
            const Content_bofill = `
            <p id="namefam" style="display:none">${nameFam}</p>
                                    <img loading="lazy" style="height: 90px;margin-left:5px" src="${imgSRC}" onerror="this.onerror=null; this.src=&#39;https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg&#39;" alt="">
                                    <div style="height: 100%;width: 210px; align-items: center; display: flex;margin-left:10px;max-width:205px; overflow-x:visible;">
                                        <div>
                                            <h5 class="fam-product">${fam.toUpperCase()}</h5>
                                            <h4 class="name-product">${name.toUpperCase()}</h4>
                                            <p class="ref-product">${ref}</p>
                                        </div>
                                    </div>
                                    <div style="width: 80px;display: flex;align-items: center;justify-content: center;position: absolute;right: 285px;flex-direction:column;gap:10px">
                                        <select id="${id_sel}" class="diam-product" name="diameter">
                                            
                                        </select>
                                        <label style="display: none;" id="value-select" for="">450</label>
                                        <input id="${id_quantity}" class="quantity-product" type="number" min="1" max="999" value="1" name="">
                                        <label style="display: none;" id="value-input" for="">1</label>
                                        </div>
                                    <div style="height: 120px;width: 35px;position: absolute;right: 240px;"><p style="font-size: 17px;
                                    position: absolute;
                                    right: 27px;
                                    font-family: 'Gotham-title';left: 0px;top: 26px">PVP:</p><p style="left: 0px;bottom: 26px;font-size: 17px;
                                    position: absolute;
                                    right: 27px;
                                    color: #105378;
                                    font-family: 'Gotham-title';" >NETO:</p></div>
                                    <div style="height: 120px;width: 150px;position: absolute;right: 65px;">
                                        <h4 id="price" style="right:5px" class="pvp-product">${pvp.toLocaleString('es-ES', numberOptionsEU)}¤</h4>
                                        <p id="price-unit" style="right:27px" class="ppu-product">${pvp.toLocaleString('es-ES', numberOptionsEU)}¤/u</p>
                                        <h4 id="netprice" style="right:5px" class="netprice-product">${np.toLocaleString('es-ES', numberOptionsEU)}¤</h4>
                                        <p id="price-unit-netprice" style="right:27px" class="ppu-netprice-product">${np.toLocaleString('es-ES', numberOptionsEU)}¤/u</p>
                                    </div>
                                    <button onclick="removeProduct(this)" style="position: absolute;right: 10px;" class="cross">
                                        <span style="transform: translateX(-50%) rotate(45deg);" class="cross-X"></span>
                                        <span style="transform: translateX(-50%) rotate(-45deg);" class="cross-Y"></span>
                                    </button>
            `
            const card_product = document.createElement("div")
            card_product.setAttribute('id',`product-${id_product}`);
            card_product.innerHTML = Content_bofill;
            card_product.classList.add("product-card")
            card_product.addEventListener('mouseover', changeColor);
            card_product.addEventListener('mouseout', changeColor);
            parent.append(card_product)
            id_product++

            let diametersOfProduct = []
            for (let i = 0; i < products.length; i++) {
                if(nameFam == products[i].namefam){
                    diametersOfProduct.push(products[i].diameter)
                    const option = document.createElement("option");
                    option.text = `Ø${products[i].diameter}` ;
                    option.value = products[i].diameter;
                    card_product.querySelector(".diam-product").appendChild(option)
                }
            }
        
            loadTotal()
            document.getElementById(id_sel).value = diam;
            card_product.querySelector("#value-select").innerHTML = diam;
            document.getElementById(id_quantity).addEventListener("input", loadPrice);
            card_product.querySelector(".diam-product").addEventListener("change", newDiameter);
            }
        }

        function newDiameter(e){
            let namefam = e.target.closest(".product-card").querySelector("#namefam").innerHTML
            for (let i = 0; i < products.length; i++) {
                if(products[i].namefam == namefam && products[i].diameter == e.target.value){
                    e.target.closest(".product-card").querySelector(".name-product").innerHTML = products[i].name
                    e.target.closest(".product-card").querySelector(".fam-product").innerHTML = products[i].family
                    e.target.closest(".product-card").querySelector(".ref-product").innerHTML = products[i].reference
                    e.target.closest(".product-card").querySelector("#price-unit").innerHTML = `${products[i].pvp.toLocaleString('es-ES', numberOptionsEU)}¤/u`; 
                }
            }
            
            const card = e.target.closest(".product-card");
            e.target.closest(".product-card").querySelector("#value-select").innerHTML = card.querySelector(".diam-product").value;
            const a = card.querySelector("#price-unit").innerHTML
            const price = (card.querySelector(".quantity-product").value * parseFloat(a.substring(0, a.length - 3).replace(/\./g, '').replace(/,/g, '.')));
            card.querySelector("#price").innerHTML = `${price.toLocaleString('es-ES', numberOptionsEU)}¤`
            let discount = document.getElementById("discount-bofill").value
            if(discount >= 100 || discount < 0){
                document.getElementById("discount-bofill").value = 0
                discount = 0
            }
            card.querySelector("#netprice").innerHTML = `${(price*(100-discount)/100).toLocaleString('es-ES', numberOptionsEU)}¤`
            card.querySelector("#price-unit-netprice").innerHTML = `${(parseFloat(a.substring(0, a.length - 3).replace(/\./g, '').replace(/,/g, '.'))*(100-discount)/100).toLocaleString('es-ES', numberOptionsEU)}¤/u`
            loadTotal()
        }

        function renderFavorites(){
            let refsFavorites = loadFromStorage("bofill")
            if(refsFavorites == undefined) refsFavorites = [];
            document.getElementById("popup").querySelector(".products-favorites").innerHTML = "";
            if(refsFavorites.length <= 0){
                document.getElementById("popup").querySelector("hr").style.display = "none";
            }
            for (let i = 0; i < refsFavorites.length; i++) {
                for (let j = 0; j < products.length; j++) {
                    if(refsFavorites[i] == products[j].reference){
                        let row = j+2;

                        const cellContentIMAGE = products[row].namefam;
                        const cellContentNAME = products[row].name;
                        const cellContentDESC = products[row].description;
                        const cellContentREF = products[row].reference;
                        const cellContentFAM = products[row].family
                        const cellContentSFAM = products[row].subfamily;
                        const cellContentPVP = products[row].pvp
                        const cellContentEAN = products[row].ean
                        const cellContentDIAMETER = products[row].diameter

                        const element = document.createElement('div')
                        const Content = `
                        <button id="favorites-white" style="align-items: center; justify-content: center;display: flex;height: 20px;width:20px;position:absolute;top:10px;right:10px;cursor:pointer;background:transparent;border:none;"> <img style=";height: 20px;width:20px;" id="favorite" src="./img/favorites-yellow.svg" alt=""> </button>
                        <img loading="lazy" id="img" src="./img/${cellContentFAM}/${cellContentIMAGE}.png" onerror="this.onerror=null; this.src='https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg';" alt="">
                        <h5 id="name" style="font-size: 20px;white-space: nowrap;">${cellContentNAME}</h5>
                        <p id="desc" style="font-size: 10px;margin-bottom: 20px;">${cellContentDESC}</p>
                        <p id="ref" style="font-size: 10px;left: 10px;position:absolute; bottom:7px;">${cellContentREF}</p>
                        <p id="diam" style="font-size: 10px;right: 10px;position:absolute; bottom:7px;">Ø${cellContentDIAMETER}</p>
                        <p id="fam" style="display:none;">${cellContentFAM}</p>
                        <p id="namefam" style="display:none;">${cellContentIMAGE}</p>
                        <p id="sfam" style="display:none;">${cellContentSFAM}</p>
                        <p id="pvp" style="display:none;">${cellContentPVP}</p>
                        <p id="ean" style="display:none;">${cellContentEAN}</p>
                        `
                        element.classList.add("card-product")
                        element.innerHTML = Content
                        element.querySelector("button").addEventListener('click', addFavorite)
                        element.addEventListener("click", addProduct);
                        document.getElementById("popup").querySelector(".products-favorites").appendChild(element)

                        break;
                    }
                }
            }
        }

        function addFavorite(e){
            let favorites = loadFromStorage("bofill");
            if(favorites == undefined) favorites = [];

            if(e.target.id == "favorite"){

                let indice = favorites.indexOf(e.target.closest(".card-product").querySelector("#ref").innerHTML);

                if (indice !== -1) {
                    favorites.splice(indice, 1);
                }

                e.target.src = "./img/favorites-white.svg"
                e.target.id = "favorites-white"
            } 
            else {
                favorites.push(e.target.closest(".card-product").querySelector("#ref").innerHTML)
                e.target.src = "./img/favorites-yellow.svg"
                e.target.id = "favorite";
            }

            const allProducts = document.getElementById("popup").querySelectorAll(".card-product");
            for (let i = 0; i < allProducts.length; i++) {
                allProducts[i].querySelector("button").querySelector("img").src = "./img/favorites-white.svg"
                allProducts[i].querySelector("button").querySelector("img").id = "favorites-white";
                for (let j = 0; j < favorites.length; j++) {
                    if(allProducts[i].querySelector("#ref").innerHTML == favorites[j]){
                        allProducts[i].querySelector("button").querySelector("img").src = "./img/favorites-yellow.svg"
                        allProducts[i].querySelector("button").querySelector("img").id = "favorite";
                    }
                }
            }

            saveToStorage("bofill",favorites)
            renderFavorites();
        }

        function openPopup(){
            document.getElementById("popup").style.visibility = "visible";
        }

        document.getElementById("referencia").addEventListener("input", (event) => {
          removeElements()
          searchByREF(document.getElementById("referencia").value)
        });
        document.getElementById("codigoean").addEventListener("input", (event) => {
          removeElements()
          searchByEAN(document.getElementById("codigoean").value)
        });
        document.getElementById("div-codigoean").addEventListener("mousedown", (event) => {
          removeElements()
          searchByEAN(document.getElementById("codigoean").value)
        });
        document.getElementById("div-referencia").addEventListener("mousedown", (event) => {
          removeElements()
          searchByREF(document.getElementById("referencia").value)
        });
        document.getElementById("div-filtre").addEventListener("mousedown", (event) => {
          searchByFILTRE()
        });
        document.getElementById("filtre-diametro").addEventListener("change", (event) => {
            searchByFILTRE()
          });
        document.getElementById("filtre-categoria").addEventListener("change", (event) => {
            let diametersRepetits = [];
            let diametersWithoutDuplicates = [];
            let category = document.getElementById('filtre-categoria')
            let famsShow = filtersJSON[category.value];
            for (let i = 0; i < products.length; i++) {
                for (let j = 0; j < famsShow.length; j++) {
                    if(products[i].family == famsShow[j]){
                        diametersRepetits.push(products[i].diameter)
                    }
                }
            }
            const arrayDiam = Array.from(new Set(diametersRepetits))
            const numbers = arrayDiam.filter(item => typeof item === 'number');
            const strings = arrayDiam.filter(item => typeof item === 'string');
            numbers.sort((a, b) => a - b);
            strings.sort();
            diametersWithoutDuplicates = [...numbers, ...strings];
            let inputDiameter = popup.querySelector("#filtre-diametro");
            inputDiameter.innerHTML = `<option value="">DIÁMETRO</option>`;
            for (let i = 0; i < diametersWithoutDuplicates.length; i++) {
                const newOption = document.createElement('option');
                newOption.value = diametersWithoutDuplicates[i];
                newOption.text = `Ø${diametersWithoutDuplicates[i]}`;
                inputDiameter.appendChild(newOption)
            }
            searchByFILTRE();
        });
        document.getElementById("filtre-familia").addEventListener("change", (event) => {
            
            searchByFILTRE();
        });
        document.getElementById("filtre-subfamilia").addEventListener("change", (event) => {
            let diametersRepetits = [];
            let diametersWithoutDuplicates = [];
            let subfamily = document.getElementById("filtre-subfamilia")
            let family = document.getElementById("filtre-familia")
            let famShow = family.value
            let subfamsShow = subfamily.value;
            for (let i = 0; i < products.length; i++) {
                if(products[i].family == famShow || products[i].additionalFamily1 == famShow || products[i].additionalFamily2 == famShow || products[i].additionalFamily3 == famShow || products[i].additionalFamily4 == famShow || products[i].additionalFamily5 == famShow){
                    if(products[i].subfamily.toUpperCase() == subfamsShow.toUpperCase()){
                        diametersRepetits.push(products[i].diameter);
                    }
                }
            }
            const arrayDiam = Array.from(new Set(diametersRepetits))
            const numbers = arrayDiam.filter(item => typeof item === 'number');
            const strings = arrayDiam.filter(item => typeof item === 'string');
            numbers.sort((a, b) => a - b);
            strings.sort();
            diametersWithoutDuplicates = [...numbers, ...strings];
            let inputDiameter = popup.querySelector("#filtre-diametro");
            inputDiameter.innerHTML = `<option value="">DIÁMETRO</option>`;
            for (let i = 0; i < diametersWithoutDuplicates.length; i++) {
                const newOption = document.createElement('option');
                newOption.value = diametersWithoutDuplicates[i];
                newOption.text = `Ø${diametersWithoutDuplicates[i]}`;
                inputDiameter.appendChild(newOption)
            }
            searchByFILTRE()
        });
        document.getElementById("nombre").addEventListener("input", (event) => {
          removeElements()
          searchByNAME(document.getElementById("nombre").value)
        });
        document.getElementById("div-nombre").addEventListener("mousedown", (event) => {
          removeElements()
          searchByNAME(document.getElementById("nombre").value)
        });
        document.getElementById("deleteFilters").addEventListener("mousedown", (event) => {
          deleteFilters();
          document.getElementById("deleteFilters").style.borderWidth = "3px";
          setTimeout(load1px, 1000); 
            function load1px(){
                document.getElementById("deleteFilters").style.borderWidth = "1px";
            }
        });
        document.getElementById("deleteFilters").addEventListener("mouseup", (event) => {
            document.getElementById("deleteFilters").style.borderWidth = "1px";
          });
        document.getElementById("button-add-product").addEventListener("click", (event) => {
            openPopup("bofill")
        });                
        function openWindow(e){
            let inputs = document.querySelector(".windows-elements").querySelectorAll(".windows-input")
            for (let i = 0; i < inputs.length; i++) {
                measureSpan.textContent = inputs[i].value || inputs[i].placeholder || '';
                const width = measureSpan.offsetWidth + 44;
                inputs[i].style.width = `${width}px`;
            }
            measureSpan.textContent = e.value || e.placeholder || '';
            let more = 75;
            const width = measureSpan.offsetWidth + more;
            e.style.width = `${width}px`;
        
            
            saveWindow();
            let windows = loadFromStorage("windows")
            cleanWindow();
            e.style.backgroundColor = "#b2b2b2";
            windowName = e.value;
            windowDateCreated = e.querySelector("#date").innerHTML
            for (let i = 0; i < windows.length; i++) {
                if(windows[i].date == windowDateCreated){
                    id_product = windows[i].id_product+1
                    document.querySelector("#discount-bofill").value = windows[i].bofill.discount
                    document.querySelector("#Bofill").querySelector(".products-container").innerHTML = windows[i].bofill.content
                    let allProductsBofill = document.querySelector("#Bofill").querySelectorAll(".product-card");
                    for (let j = 0; j < allProductsBofill.length; j++) {
                        allProductsBofill[j].addEventListener('mouseover', changeColor);
                        allProductsBofill[j].addEventListener('mouseout', changeColor);
                        allProductsBofill[j].querySelector(".quantity-product").value = allProductsBofill[j].querySelector("#value-input").innerHTML
                        allProductsBofill[j].querySelector(".diam-product").value = allProductsBofill[j].querySelector("#value-select").innerHTML
                    }
                    for (let j = 0; j < windows[i].competitors.length; j++) {
                        let competitor = addCompetitor(windows[i].competitors[j].name)
                        competitor.querySelector(".input-discount").value = windows[i].competitors[j].discount
                        if(windows[i].competitors[j].name != "COMPETIDOR") getCompetitor(competitor,false)
                        competitor.querySelector(".products-container").innerHTML = windows[i].competitors[j].content
                        let allProductsCompetitor = competitor.querySelectorAll(".product-card");
                        if(allProductsCompetitor.length > document.querySelector("#Bofill").querySelectorAll(".product-card").length){
                            allProductsCompetitor[allProductsCompetitor.length - 1].remove()
                        }
                        for (let k = 0; k < allProductsCompetitor.length; k++) {
                            allProductsCompetitor[k].addEventListener('mouseover', changeColor);
                            allProductsCompetitor[k].addEventListener('mouseout', changeColor);
                        }
                    }
                }
            }
            loadTotal();
        
            const productes = document.querySelector("#Bofill").querySelectorAll(".quantity-product");
            for (let i = 0; i < productes.length; i++) {
                productes[i].addEventListener("input", (event) => {
                    productes[i].closest(".product-card").querySelector("#value-input").innerHTML = productes[i].value;
                
                    const card = productes[i].closest(".product-card")
                    const a = card.querySelector("#price-unit").innerHTML
                    const price = (productes[i].value * parseFloat(a.substring(0, a.length - 3).toLocaleString('en-EN',numberOptionsEN)));
                    card.querySelector("#price").innerHTML = `${price.toLocaleString('es-ES', numberOptionsEU)}¤`
                    let discount = document.getElementById("discount-bofill").value
                    if(discount >= 100 || discount < 0){
                        document.getElementById("discount-bofill").value = 0
                        discount = 0
                    }
                    card.querySelector("#netprice").innerHTML = `${(price*(100-discount)/100).toLocaleString('es-ES', numberOptionsEU)}¤`
                    card.querySelector("#price-unit-netprice").innerHTML = `${(parseFloat(a.substring(0, a.length - 3).toLocaleString('en-EN',numberOptionsEN))*(100-discount)/100).toLocaleString('es-ES', numberOptionsEU)}¤/u`
                    loadTotal()
                });
            }
        
            const productesDiam = document.querySelector("#Bofill").querySelectorAll(".diam-product");
            for (let i = 0; i < productesDiam.length; i++) {
                productesDiam[i].addEventListener("change", (e) => {
                    let namefam = e.target.closest(".product-card").querySelector("#namefam").innerHTML
                    for (let i = 0; i < products.length; i++) {
                        if(products[i].namefam == namefam && products[i].diameter == e.target.value){
                            e.target.closest(".product-card").querySelector(".name-product").innerHTML = products[i].name
                            e.target.closest(".product-card").querySelector(".fam-product").innerHTML = products[i].family
                            e.target.closest(".product-card").querySelector(".ref-product").innerHTML = products[i].reference
                            e.target.closest(".product-card").querySelector("#price-unit").innerHTML = `${products[i].pvp.toLocaleString('es-ES', numberOptionsEU)}¤/u`; 
                        }
                    }
        
                    const card = e.target.closest(".product-card");
                    e.target.closest(".product-card").querySelector("#value-select").innerHTML = card.querySelector(".diam-product").value;
                    const a = card.querySelector("#price-unit").innerHTML
                    const price = (card.querySelector(".quantity-product").value * parseFloat(a.substring(0, a.length - 3).replace(/\./g, '').replace(/,/g, '.')));
                    card.querySelector("#price").innerHTML = `${price.toLocaleString('es-ES', numberOptionsEU)}¤`
                    let discount = document.getElementById("discount-bofill").value
                    if(discount >= 100 || discount < 0){
                        document.getElementById("discount-bofill").value = 0
                        discount = 0
                    }
                    card.querySelector("#netprice").innerHTML = `${(price*(100-discount)/100).toLocaleString('es-ES', numberOptionsEU)}¤`
                    card.querySelector("#price-unit-netprice").innerHTML = `${(parseFloat(a.substring(0, a.length - 3).replace(/\./g, '').replace(/,/g, '.'))*(100-discount)/100).toLocaleString('es-ES', numberOptionsEU)}¤/u`
                    loadTotal()
                })
            }
        }
        function renderWindows(){
            let windows = loadFromStorage("windows")
            if(windows == undefined) windows = [];
            document.querySelector(".windows-elements").innerHTML = "";
        
            for (let i = 0; i < windows.length; i++) {
                const div2 = document.createElement("div")
                const div = document.createElement("input")
                div.type = "text";
                div.value = windows[i].name
                div.innerHTML = `<p id="date" placeholder="Título..." style="display: none;">${windows[i].date}</p>
                <p id="id_product" style="display: none;">${windows[i].id_product}</p>`
                div.classList.add("windows-input")
                div2.style.position = "relative"
                div2.innerHTML = `<button class="edit-name-window" style="cursor:pointer;background: transparent;border:none;width: 30px;height: 35px;top: 1px;right: 1px;border-radius: 10px;position:absolute">
                <img src="./img/edit.svg" style="width: 20px;height: 20px;margin-top:3px" alt=""> </button>
                <button style="background: rgb(178, 178, 178);width: 30px;height: 35px;top: 1px;right: 1px;border-radius: 10px;display:none;" class="cross">
                <span style="width: 1em;transform: translateX(-50%) rotate(45deg);" class="cross-X"></span>
                <span style="width: 1em;transform: translateX(-50%) rotate(-45deg);" class="cross-Y"></span>
                </button>`
                div2.appendChild(div)
                document.querySelector(".windows-elements").appendChild(div2);
                div.addEventListener("input", (event) => {
                    adjustWidth(div);
                });
                div.addEventListener("change", (event) => {
                    saveWindow()
                });
                measureSpan.textContent = div.value || div.placeholder || '';
                const width = measureSpan.offsetWidth + 44;
                div.style.width = `${width}px`;
        
                if(windows[i].name == windowName) div.style.backgroundColor = "#b2b2b2";
                div2.querySelector(".cross").addEventListener("click", deleteWindow);
                div2.querySelector(".edit-name-window").addEventListener("click", (event) => {
                    openWindow(div);
                    editNameWindow(event);
                });
                div.addEventListener("click", (event) => {
                    
                    openWindow(div);
                });
                div.addEventListener("click", focusWindow);
            }
        }
        function addCompetitor(name){
            const Content = `
            <select title="Seleccionar competidor" class="select-competitor" name="competitors">
                <option value="COMPETIDOR">COMPETIDOR</option>
            </select>
            <div id="div-discount" style="position:absolute; top:15px; right:80px; border: solid 1px; height: 40px;width: 105px;border-radius: 10px;">
                <h3 style="font-size: 20px; margin-top: 5px;margin-left: 10px;">-</h3>
                <input class="input-discount" type="number" name="discount" min="0" max="99" value="0" id="">
                
                <h3 style="position: absolute;top: 10px;right: 15px;font-size: 20px; margin-top: -4px;margin-left: 10px;">%</h3>
                <div style="z-index: 50;cursor: pointer;flex-direction: column;display: flex;gap: 0px;width: 20px;height: 100%;position: absolute;top: 0px;right: 5px;">
                    <button id="sumDiscountCompetitor" style="background: transparent;border: none;height: 19px;width: 19px;cursor: pointer;"><img style="height: 19px;width: 19px;" src="./img/arrow-top.svg" alt=""></button>
                    <button id="restDiscountCompetitor" style="background: transparent;border: none;height: 19px;width: 19px;cursor: pointer;"><img style="height: 19px;width: 19px;" src="./img/arrow-bottom.svg" alt=""></button>
                </div>
            </div>
                            <div style="position: absolute;top: 27px;right: 200px;width: 40px;display:none" class="loader"></div>
            <button onclick="removeCompetitor(this)" class="button-competitor cross">
                <span style="transform: translateX(-50%) rotate(45deg);" class="cross-X"></span>
                <span style="transform: translateX(-50%) rotate(-45deg);" class="cross-Y"></span>
            </button>
            <div class="products-container">
            </div>
            <div style="width: 90%;height: 50px;color: #333;right: 0px;display: flex;position: absolute;font-size: 30px;margin-bottom: 15px;margin-right: 4%;align-items: center;justify-content: center;gap: 10%;bottom: 145px;">
                    <div style="width: 158px;justify-content: center;align-items: center;display: flex;"></div>
                    <div style="width: calc(10% + 320px);justify-content: center;align-items: center;display: flex;"><h4 id="competitorvsbofill" style="font-size: 20px;">COMPETIDOR VS BOFILL</h4></div>
                    
                </div>
                <div style="width: 90%;height: 50px;color: #333;right: 0px;display: flex;position: absolute;font-size: 30px;margin-bottom: 15px;margin-right: 4%;align-items: center;justify-content: center;gap: 10%;bottom: 110px;">
                <div style="
        
        width: 160px;
        justify-content: center;
        align-items: center;
        display: flex;
        "></div>
                <div style="
        
        width: 160px;
        justify-content: center;
        align-items: center;
        display: flex;
        "><h4 style="font-size: 18px;">%</h4></div>
                <div style="
        
        width: 160px;
        justify-content: center;
        align-items: center;
        display: flex;
        "><h4 style="font-size: 18px;">¤</h4></div>
            </div>
            <div class="total-competitor" style="margin-right: 4%;align-items: center;justify-content: center;gap: 10%;bottom: 73px;">
                    <div style="
        
            width: 160px;
            justify-content: center;
            align-items: center;
            display: flex;
        "><h4 id="total-pvpprice">XX,XX¤</h4></div>
                    <div style="
        
            width: 160px;
            justify-content: center;
            align-items: center;
            display: flex;
        "><h4 id="pvp-difference-percentatge" style="font-size: 30px; color: rgb(152, 10, 10);" class="difference-percentatge">+XX,X%</h4></div>
                    <div style="
        
            width: 160px;
            justify-content: center;
            align-items: center;
            display: flex;
        "><h4 id="pvp-difference-absolute" style="font-size: 30px; color: rgb(152, 10, 10);" class="difference-absolute">+XX,X¤</h4></div>
                </div>
            <div class="total-competitor" style="margin-right: 4%;align-items: center;justify-content: center;gap: 10%;">
                    <div style="
        
            width: 160px;
            justify-content: center;
            align-items: center;
            display: flex;
        "><h4 id="total-netprice" style="color:#105378">XX,XX¤</h4></div>
                    <div style="
        
            width: 160px;
            justify-content: center;
            align-items: center;
            display: flex;
        "><h4 id="netprice-difference-percentatge" style="font-size: 30px; color: rgb(152, 10, 10);" class="difference-percentatge">+XX,X%</h4></div>
                    <div style="
        
            width: 160px;
            justify-content: center;
            align-items: center;
            display: flex;
        "><h4 id="netprice-difference-absolute" style="font-size: 30px; color: rgb(152, 10, 10);" class="difference-absolute">+XX,X¤</h4></div>
                </div>
                
            `
            const card_container = document.createElement("div")
            card_container.classList.add("card-container")
            card_container.innerHTML = Content;
            const parent = document.querySelector(".container")
            card_container.querySelector("#sumDiscountCompetitor").addEventListener("click",  (e) => {
                if(e.target.closest("#div-discount").querySelector("input").value < 99){
                    e.target.closest("#div-discount").querySelector("input").value++;

                    let event = new Event('input');
                    e.target.closest("#div-discount").querySelector("input").dispatchEvent(event);
                }
            });
            card_container.querySelector("#restDiscountCompetitor").addEventListener("click",  (e) => {
                if(e.target.closest("#div-discount").querySelector("input").value > 0){
                    e.target.closest("#div-discount").querySelector("input").value--;

                    let event = new Event('input');
                    e.target.closest("#div-discount").querySelector("input").dispatchEvent(event);
                }
            });
        
            const select = card_container.querySelector(".select-competitor")
            for (let i = 0; i < competitors.length; i++) {
                if(competitors[i][0].toUpperCase() != "BOFILL"){
                    const newOption = document.createElement('option');
                    newOption.value = competitors[i][0];
                    newOption.text = competitors[i][0].toUpperCase();
                    if(name != undefined && newOption.value == name) newOption.selected = true;
                    select.appendChild(newOption)
                }
            }
            parent.append(card_container)
        
            card_container.querySelector(".select-competitor").addEventListener("change", (event) => {
                getCompetitor(card_container,true)
            });
            const products = document.getElementById("Bofill").querySelectorAll(".product-card")
        
            if(document.querySelectorAll('.card-container').length >= 3){
                document.querySelector(".comparar-mes").style.display = "none";
                document.querySelector(".container").style.paddingRight = "10px";
            }
        
            adjustSelectWidth();
            if(windowName == ""){
                windowName = windowDateCreated;
                saveWindow();
                renderWindows();
            }
            return card_container;
        }
        this.document.getElementById("add-competitor-button").addEventListener("click", addCompetitor)

        function newWindow(){
            saveWindow();
            cleanWindow();
            windowDateCreated = createName();
            windowName = createName();
            id_product = 0;
            saveWindow();
            renderWindows();
        }
        this.document.getElementById("new-window-button").addEventListener("click", newWindow);

        function deleteWindow(e){
            let windows = loadFromStorage("windows")
            let date = e.target.closest("div").querySelector("#date").innerHTML
            for (let i = 0; i < windows.length; i++) {
                if(windows[i].date == date){
                    windows.splice(i,1)
                    windowName = "";
                }
            }
            saveToStorage("windows",windows)
            cleanWindow();
            renderWindows();
        }
        document.getElementById("page").style.display = "block";
        document.getElementById("load").style.display = "none";
    })
    .catch(error => {
        console.error('Error al leer el archivo:', error);
        doError("NO S'HA TROBAT EXCEL DE BOFILL");
    });
    document.getElementById("page").style.display = "block";
        document.getElementById("load").style.display = "none";
    

    

    this.document.getElementById("discount-bofill").addEventListener("input", (event) => {
        let discount = document.getElementById("discount-bofill").value
        if(discount >= 100 || discount < 0){
            document.getElementById("discount-bofill").value = 0;
            discount = 0;
        }
        let a = this.document.getElementById("Bofill").querySelectorAll(".product-card")
        for (let i = 0; i < a.length; i++) {
            const priceunit = parseFloat(a[i].querySelector("#price-unit").innerHTML.slice(0,-3).replace(/\./g, '').replace(/,/g, '.'));
            const price = (a[i].querySelector(".quantity-product").value * priceunit);
            a[i].querySelector("#price").innerHTML = `${price.toLocaleString('es-ES', numberOptionsEU)}¤`
            a[i].querySelector("#netprice").innerHTML = `${(price*(100-discount)/100).toLocaleString('es-ES', numberOptionsEU)}¤`
            a[i].querySelector("#price-unit-netprice").innerHTML = `${(priceunit*(100-discount)/100).toLocaleString('es-ES', numberOptionsEU)}¤/u`
            loadTotal()
        }
    });

    let a = document.querySelectorAll('.product-card')
    for (let i = 0; i < a.length; i++) {
        a[i].addEventListener('mouseover', changeColor);
        a[i].addEventListener('mouseout', changeColor);
    }
    a = document.querySelectorAll('.quantity-product')
    for (let i = 0; i < a.length; i++) {
        a[i].addEventListener("input", loadPrice);
    } 
});

window.addEventListener('beforeunload', function (event) {
    saveWindow();
});