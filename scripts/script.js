let competitors;
let competitorsJSON;
let filtersJSON;

const numberOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
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

let id_product = 0;
let productEdit;
let windowName = createName()

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

function addCompetitor(name){
    const Content = `
    <select class="select-competitor" name="competitors">
        <option value="COMPETIDOR">COMPETIDOR</option>
    </select>
    <div style="position:absolute; top:15px; right:80px; border: solid 1px; height: 40px;width: 90px;border-radius: 10px;">
                        <h3 style="font-size: 20px; margin-top: 5px;margin-left: 10px;">-</h3>
                        <input class="input-discount" type="number" name="discount" min="0" max="99" value="0" id="">
                        <h3 style="position: absolute;top: 10px;right: 0px;font-size: 20px; margin-top: -4px;margin-left: 10px;">%</h3>
                    </div>
    <button onclick="removeCompetitor(this)" class="button-competitor cross">
        <span style="transform: translateX(-50%) rotate(45deg);" class="cross-X"></span>
        <span style="transform: translateX(-50%) rotate(-45deg);" class="cross-Y"></span>
    </button>
    <div class="products-container">
    </div>
    <div class="total-competitor" style="bottom: 73px;">
        <h4 id="total-pvpprice" style="
    margin-top: 7px;
">XX.XX¤</h4>
    <div style="width: 60px;height: 100%;position: absolute;right: 10px;display:flex;justify-content:center;flex-direction:column;align-items:center;">
                                <h4 id="" style="position: relative;font-size:15px;color:#980a0a;right: 0px;" class="difference-percentatge">+XX,X%</h4>
                                <h4 id="" style="margin: 0px;position: relative;right: 0px;font-size:15px;color:#980a0a;" class="difference-absolute">+XX,X¤</h4>
                            </div></div>
    <div class="total-competitor" style="color: #105378;">
        <h4 id="total-netprice" style="
    margin-top: 7px;
">XX.XX¤</h4>
        <div style="width: 60px;height: 100%;position: absolute;right: 10px;display:flex;justify-content:center;flex-direction:column;align-items:center;">
                                <h4 id="" style="position: relative;font-size:15px;color:#980a0a;right: 0px;" class="difference-percentatge">+XX,X%</h4>
                                <h4 id="" style="margin: 0px;position: relative;right: 0px;font-size:15px;color:#980a0a;" class="difference-absolute">+XX,X¤</h4>
                            </div>
    </div>
    `
    const card_container = document.createElement("div")
    card_container.classList.add("card-container")
    card_container.innerHTML = Content;
    const parent = document.querySelector(".container")

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

    adjustSelectWidth()
    return card_container;
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
    const card = e.target.closest(".product-card")
    const a = card.querySelector("#price-unit").innerHTML
    const price = (e.target.value * a.substring(0, a.length - 3)).toLocaleString('es-ES', numberOptions);
    card.querySelector("#price").innerHTML = `${price}¤`
    let discount = document.getElementById("discount-bofill").value
    if(discount >= 100 || discount < 0){
        document.getElementById("discount-bofill").value = 0
        discount = 0
    }
    card.querySelector("#netprice").innerHTML = `${(price*(100-discount)/100).toLocaleString('es-ES', numberOptions)}¤`
    loadTotal()
}

function loadTotal(){
    let a = document.getElementById('Bofill').querySelectorAll('.product-card')
    var totalPvpPrice = 0.0;
    var totalNetPrice = 0.0;
    for (let i = 0; i < a.length; i++) {
        let pvp = a[i].querySelector('#price').innerHTML
        let net = a[i].querySelector('#netprice').innerHTML
        var pvpprice = pvp.substring(0, pvp.length - 1)
        var netprice = net.substring(0, net.length - 1)
        totalPvpPrice += parseFloat(pvpprice);
        totalNetPrice += parseFloat(netprice);
    }
    document.getElementById('total-pvpprice').innerHTML = `${totalPvpPrice.toLocaleString('es-ES', numberOptions)}¤`
    document.getElementById('total-netprice').innerHTML = `${totalNetPrice.toLocaleString('es-ES', numberOptions)}¤`
}

function addProduct(e){
    closePopup()
    const input = e.target
    const card = input.closest(".card-product")
    const name = card.querySelector("#name").innerHTML
    const ref = card.querySelector("#ref").innerHTML
    const fam = card.querySelector("#fam").innerHTML
    const pvp = parseFloat(card.querySelector("#pvp").innerHTML).toLocaleString('es-ES', numberOptions)
    const np = (pvp*(100-document.getElementById("discount-bofill").value)/100).toLocaleString('es-ES', numberOptions)
    const diam = card.querySelector("#desc").innerHTML.split(' ')[card.querySelector("#desc").innerHTML.split(' ').length - 1].substring(1);
    const bofill = document.querySelector("#Bofill")
    const parent = bofill.querySelector(".products-container")
    
    const id_sel = `select-${id_product}`
    const id_quantity = `price-${id_product}`
    let caracter = name[name.length - 6];
    let nameImg;
    if(name.startsWith("CODPRP")){
        nameImg = "CODPRP"
    }else if(!isNaN(caracter) && caracter >= '0' && caracter <= '9'){
        nameImg = name.slice(0, -6);
    }else{
        nameImg = name.slice(0, -3);
    }
    const Content_bofill = `
                            <img loading="lazy" style="height: 90px;margin-left:5px" src="./img/FOTOS ${fam}/${nameImg}.png" onerror="this.onerror=null; this.src=&#39;https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg&#39;" alt="">
                            <div style="height: 100%;width: 210px; align-items: center; display: flex;margin-left:10px;max-width:205px; overflow-x:visible;">
                                <div>
                                    <h5 class="fam-product">${fam.toUpperCase()}</h5>
                                    <h4 class="name-product">${name.toUpperCase()}</h4>
                                    <p class="ref-product">${ref}</p>
                                </div>
                            </div>
                            <div style="width: 80px;display: flex;align-items: center;justify-content: center;position: absolute;right: 305px;flex-direction:column;gap:10px">
                                <select id="${id_sel}" class="diam-product" name="diameter">
                                    <option value="080">Ø080</option>
                                    <option value="100">Ø100</option>
                                    <option value="125">Ø125</option>
                                    <option value="130">Ø130</option>
                                    <option value="150">Ø150</option>
                                    <option value="175">Ø175</option>
                                    <option value="180">Ø180</option>
                                    <option value="200">Ø200</option>
                                    <option value="250">Ø250</option>
                                    <option value="300">Ø300</option>
                                    <option value="350">Ø350</option>
                                    <option value="400">Ø400</option>
                                    <option value="450">Ø450</option>
                                    <option value="500">Ø500</option>
                                    <option value="550">Ø550</option>
                                    <option value="600">Ø600</option>
                                    <option value="650">Ø650</option>
                                    <option value="700">Ø700</option>
                                </select>
                                <input id="${id_quantity}" class="quantity-product" type="number" min="1" max="999" value="1" name="">
                            </div>
                            <div style="height: 120px;width: 150px;position: absolute;right: 155px;">
                                <h4 id="price" style="right:5px" class="pvp-product">${pvp}¤</h4>
                                <p id="price-unit" style="right:27px" class="ppu-product">${pvp}¤/u</p>
                                <h4 id="netprice" style="right:5px" class="netprice-product">${np}¤</h4>
                                <p id="price-unit-netprice" style="right:27px" class="ppu-netprice-product">${np}¤/u</p>
                            </div>
                            <button onclick="" class="cart-product">
                                <img loading="lazy" style="width:40px" src="./img/cart.png" onerror="this.onerror=null; this.src=&#39;https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg&#39;" alt="">
                            </button>
                            <button onclick="removeProduct(this)" style="position: absolute;right: 20px;" class="cross">
                                <span style="transform: translateX(-50%) rotate(45deg);" class="cross-X"></span>
                                <span style="transform: translateX(-50%) rotate(-45deg);" class="cross-Y"></span>
                            </button>
    `
    card_product = document.createElement("div")
    card_product.setAttribute('id',`product-${id_product}`);
    card_product.innerHTML = Content_bofill;
    card_product.classList.add("product-card")
    card_product.addEventListener('mouseover', changeColor);
    card_product.addEventListener('mouseout', changeColor);
    parent.append(card_product)
    id_product++

    loadTotal()
    document.getElementById(id_sel).value = diam;
    document.getElementById(id_quantity).addEventListener("change", loadPrice);
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
    console.log(a)
    var fileUrl = `../${a.querySelector(".select-competitor").value}.xlsx`;
    fetch(fileUrl)
        .then(response => response.arrayBuffer())
        .then(data => {

            const discount = a.querySelector(".input-discount")
            console.log(discount)
            a.querySelector(".select-competitor").disabled = true;

            let competitorInfo = competitorsJSON[a.querySelector(".select-competitor").value]
            console.log(a.querySelector(".select-competitor"),competitorInfo)

            const Content = `
            <div class="popup-card">
            <h3 style="font-size: 30px;margin: 40px;">${a.querySelector(".select-competitor").value.toUpperCase()}</h3>
            <button style="top:30px;right: 30px;" class="cross close">
                <span style="transform: translateX(-50%) rotate(45deg);" class="cross-X"></span>
                <span style="transform: translateX(-50%) rotate(-45deg);" class="cross-Y"></span>
            </button>
            <div class="popup-filtre-competitor">
            <div id="div-filtre" class="filtre">
                        <select id="filtre-familia" class="select-filtre" name="FAMILIA" title="FAMILIA">
                            <option value="" disabled="" selected="">FAMILIA</option>
                        </select>
                        <select id="filtre-subfamilia" class="select-filtre" name="SUBFAMILIA" title="SUBFAMILIA">
                            <option value="" disabled="" selected="">SUBFAMILIA</option>
                        </select>
                        <select id="filtre-diametro" class="select-filtre" name="DIAMETRO" title="DIAMETRO">
                            <option value="" selected="">DIÁMETRO</option>
                        </select>
                    </div>
                <div id="reference" class="filtre" style="margin-left: 10px;">
                    <input id="referencia" placeholder="REFERENCIA" type="text">
                </div>
                <div id="name" class="filtre" style="margin-left: 10px;">
                    <input id="nombre" style="text-transform:none;" placeholder="NOMBRE" type="text">
                </div>
                <div id="ean" class="filtre" style="margin-left: 10px;">
                        <input id="codigoean" placeholder="CÓDIGO EAN" type="text">
                    </div>
                <button class="filtre-delete">
                    <img loading="lazy" style="height: 30px;" src="./img/borrar-filtres.svg" onerror="this.onerror=null; this.src='https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg';" alt="">
                </button>
            </div>
            <div style="overflow-y: scroll;height: 573px; width: 100%;margin-top: 2em;">
                <div class="products-created" style="width: 500px; width: 100%;display: flex; flex-wrap: wrap;justify-content: center; gap: 2rem;">
                    <div class="card-create-product">
                        <button style="background-color: #b2b2b2;position: relative;" class="cross add">
                            <span style="transform: translateX(-52%) rotate(0deg);" class="cross-X"></span>
                            <span style="transform: translateX(-52%) rotate(90deg);" class="cross-Y"></span>
                        </button>
                    </div>
                </div>
                <hr style="background-color: #333;height: 5px;margin-left: 5%; width: 90%; margin-top: 30px;margin-bottom: 30px;">
                <div class="products-competitor" >
                
                </div>
            </div>
        </div>
            `
            const popup = document.createElement("div");
            popup.setAttribute("id", `popup-${a.id}`)
            popup.setAttribute("class", "popup")
            popup.innerHTML = Content;
            document.getElementById("page").append(popup);
            popup.querySelector(".close").addEventListener('click',closePopup)
            
            popup.querySelector(".filtre-delete").addEventListener("click", (event) => {
                deleteFilters()
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
            
            let colIndex;
            let names = []
            let descriptions = []
            let eans = []
            let references = []
            let pvps = []
            let families = []
            let subfamilies = []
            let diameters = []

            const worker = new Worker('./scripts/worker.js');
            worker.postMessage(data);
            worker.onmessage = function (e) {
                const workbook = e.data;
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const range = XLSX.utils.decode_range(worksheet['!ref']);

                console.log("name")
                if(haveName){
                    colIndex = columnLetterToNumber(competitorInfo.name)

                    for (let row = range.s.r+competitorInfo.startingRow-1; row <= range.e.r; row++) {
                        const cellAddress = XLSX.utils.encode_cell({ r: row, c: colIndex - 1 });
                        const cell = worksheet[cellAddress];
                        names.push(cell ? cell.v : '');
                    }
                    console.log(names)
                }

                console.log("desc")
                if(haveDescription){
                    colIndex = columnLetterToNumber(competitorInfo.description)

                    for (let row = range.s.r+competitorInfo.startingRow-1; row <= range.e.r; row++) {
                        const cellAddress = XLSX.utils.encode_cell({ r: row, c: colIndex - 1 });
                        const cell = worksheet[cellAddress];
                        descriptions.push(cell ? cell.v : '');
                    }
                    console.log(descriptions)
                }

                console.log("ean")
                if(haveEan){
                    colIndex = columnLetterToNumber(competitorInfo.eanCode)

                    for (let row = range.s.r+competitorInfo.startingRow-1; row <= range.e.r; row++) {
                        const cellAddress = XLSX.utils.encode_cell({ r: row, c: colIndex - 1 });
                        const cell = worksheet[cellAddress];
                        eans.push(cell ? cell.v : '');
                    }
                    console.log(eans)
                }

                console.log("references")
                if(haveReference){
                    colIndex = columnLetterToNumber(competitorInfo.reference)

                    for (let row = range.s.r+competitorInfo.startingRow-1; row <= range.e.r; row++) {
                        const cellAddress = XLSX.utils.encode_cell({ r: row, c: colIndex - 1 });
                        const cell = worksheet[cellAddress];
                        references.push(cell ? cell.v : '');
                    }
                    console.log(references)
                }

                console.log("pvp")
                if(havePvp){
                    colIndex = columnLetterToNumber(competitorInfo.pvp)

                    for (let row = range.s.r+competitorInfo.startingRow-1; row <= range.e.r; row++) {
                        const cellAddress = XLSX.utils.encode_cell({ r: row, c: colIndex - 1 });
                        const cell = worksheet[cellAddress];
                        pvps.push(cell ? cell.v : '');
                    }
                    console.log(pvps)
                }

                console.log("family")
                if(haveFamily){
                    colIndex = columnLetterToNumber(competitorInfo.family)

                    for (let row = range.s.r+competitorInfo.startingRow-1; row <= range.e.r; row++) {
                        const cellAddress = XLSX.utils.encode_cell({ r: row, c: colIndex - 1 });
                        const cell = worksheet[cellAddress];
                        families.push(cell ? cell.v : '');
                    }
                    console.log(families)
                }

                console.log("subfamily")
                if(haveSubfamily){
                    colIndex = columnLetterToNumber(competitorInfo.subfamily)

                    for (let row = range.s.r+competitorInfo.startingRow-1; row <= range.e.r; row++) {
                        const cellAddress = XLSX.utils.encode_cell({ r: row, c: colIndex - 1 });
                        const cell = worksheet[cellAddress];
                        subfamilies.push(cell ? cell.v : '');
                    }
                    console.log(subfamilies)
                }

                console.log("diameter")
                if(haveDiameter || (haveInletdiameter && haveOutletdiameter)){
                    if(haveDiameter && haveInletdiameter && haveOutletdiameter){
                        colIndex = columnLetterToNumber(competitorInfo.diameter)
                        let colIndex2 = columnLetterToNumber(competitorInfo.outletDiameter)
                        let colIndex3 = columnLetterToNumber(competitorInfo.outletDiameter)

                        for (let row = range.s.r+competitorInfo.startingRow-1; row <= range.e.r; row++) {
                            const cellAddress = XLSX.utils.encode_cell({ r: row, c: colIndex - 1 });
                            const cell = worksheet[cellAddress];
                            if((cell ? cell.v : '') == '' || (cell ? cell.v : '') == '-'){
                                const cellAddress2 = XLSX.utils.encode_cell({ r: row, c: colIndex2 - 1 });
                                const cell2 = worksheet[cellAddress2];
                                const cellAddress3 = XLSX.utils.encode_cell({ r: row, c: colIndex3 - 1 });
                                const cell3 = worksheet[cellAddress3];
                                diameters.push(`${cell2 ? cell2.v : ''}-${cell3 ? cell3.v : ''}`);
                            }
                        }
                    }else if(!haveDiameter){
                        colIndex = columnLetterToNumber(competitorInfo.inletDiameter)
                        let colIndex2 = columnLetterToNumber(competitorInfo.outletDiameter)

                        for (let row = range.s.r+competitorInfo.startingRow-1; row <= range.e.r; row++) {
                            const cellAddress = XLSX.utils.encode_cell({ r: row, c: colIndex - 1 });
                            const cell = worksheet[cellAddress];
                            const cellAddress2 = XLSX.utils.encode_cell({ r: row, c: colIndex2 - 1 });
                            const cell2 = worksheet[cellAddress2];
                            if((cell ? cell.v : '') == '' || (cell ? cell.v : '') == '-' || (cell2 ? cell2.v : '') == '' || (cell2 ? cell2.v : '') == '-'){
                                if(((cell ? cell.v : '') == '' || (cell ? cell.v : '') == '-') && ((cell2 ? cell2.v : '') == '' || (cell2 ? cell2.v : '') == '-')){
                                    console.log("dont have diameter")
                                }
                                else if((cell ? cell.v : '') == '' || (cell ? cell.v : '') == '-'){
                                    diameters.push(cell2 ? cell2.v : '')
                                }else{
                                    diameters.push(cell ? cell.v : '')
                                }
                            }else{
                                diameters.push(`${cell ? cell.v : ''}-${cell2 ? cell2.v : ''}`);
                            }
                            
                        }
                    }else{
                        colIndex = columnLetterToNumber(competitorInfo.diameter)

                        for (let row = range.s.r+competitorInfo.startingRow-1; row <= range.e.r; row++) {
                            const cellAddress = XLSX.utils.encode_cell({ r: row, c: colIndex - 1 });
                            const cell = worksheet[cellAddress];
                            diameters.push(cell ? cell.v : '');
                        }
                    }
                    console.log(diameters)
                }

                if (!haveReference) {
                    popup.querySelector("#reference").remove()
                }else{
                    popup.querySelector("#referencia").addEventListener("change", (event) => {
                        searchByREF(popup.querySelector("#referencia").value)
                    });
                }
                
                if (!haveName) {
                    popup.querySelector("#name").remove()
                }else{
                    popup.querySelector("#nombre").addEventListener("change", (event) => {
                        searchByNAME(popup.querySelector("#nombre").value)
                    });
                }
                
                if (!haveEan) {
                    popup.querySelector("#ean").remove()
                }else{
                    popup.querySelector("#ean").addEventListener("change", (event) => {
                        searchByEAN(popup.querySelector("#ean").value)
                    });
                }
                
                if (!haveDiameter && !haveSubfamily && !haveFamily && !haveInletdiameter && !haveOutletdiameter) {
                    popup.querySelector("#div-filtre").remove()
                }else{
                    if(!haveDiameter && !haveInletdiameter && !haveOutletdiameter){
                        popup.querySelector("#filtre-diametro").remove()
                    }else{
                        const arrayDiam = Array.from(new Set(diameters))
                        const numbers = arrayDiam.filter(item => typeof item === 'number');
                        const strings = arrayDiam.filter(item => typeof item === 'string');

                        numbers.sort((a, b) => a - b);
                        strings.sort();

                        const diametersWithoutDuplicates = [...numbers, ...strings];

                        console.log("here",diametersWithoutDuplicates)

                        let inputDiameter = popup.querySelector("#filtre-diametro");

                        for (let i = 0; i < diametersWithoutDuplicates.length; i++) {
                            const newOption = document.createElement('option');
                            newOption.value = diametersWithoutDuplicates[i];
                            newOption.text = diametersWithoutDuplicates[i];
                            inputDiameter.appendChild(newOption)
                        }
                        inputDiameter.addEventListener("change", (event) => {
                            searchByFILTRE();
                        });
                    }
                    if(!haveSubfamily){
                        popup.querySelector("#filtre-subfamilia").remove()
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
                            searchByFILTRE();
                        });
                    }
                    if(!haveFamily){
                        popup.querySelector("#filtre-familia").remove()
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
                            searchByFILTRE();
                        });
                    }
                }
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

            function addElements(row) {
                console.log(row)
                const cellContentNAME = names[row]
                const cellContentDESC = descriptions[row]
                const cellContentEAN = eans[row]
                const cellContentREF = references[row]
                const cellContentPVP = pvps[row]
                const cellContentFAM = families[row]
                const cellContentSFAM = subfamilies[row]
                let diam;
                diam = diameters[row]

                const element = document.createElement('div')
                const Content = `
                <p id="fam" style="font-size:15px">${families[row]}</p>
                <p id="sfam" style="font-size:10px">${subfamilies[row]}</p>
                <h5 id="name" style="font-size: 20px;">${names[row]}</h5>
                <p id="desc" style="font-size: 10px;">${descriptions[row]}</p>
                <p id="pvp" style="font-size: 25px; margin-top:10px;margin-bottom:20px">${pvps[row]}¤</p>
                <p id="ref" style="font-size: 12px;left: 10px;position:absolute; bottom:7px;">${references[row]}</p>
                <p id="diam" style="font-size: 12px;right: 10px;position:absolute; bottom:7px;">Ø${diam}</p>
                <p id="ean" style="display:none;">${eans[row]}</p>
                `
                element.classList.add("card-product")
                element.style.height = "auto"
                element.innerHTML = Content
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
                }if (diam == undefined) {
                    element.querySelector("#diam").style.display = "none"
                }
            }

            function searchByREF(ref){
                popup.querySelector(".products-created").style.display = "none";
                popup.querySelector("hr").style.display = "none";
                console.log(ref)
                if(ref == ""){
                    addFirstElements();
                    popup.querySelector(".products-created").style.display = "flex";
                popup.querySelector("hr").style.display = "block";
                }else{
                    removeElements()
                    for (let i = 0; i < references.length; i++) {
                        if((references[i].toString()).startsWith(ref.toString())){
                            addElements(i)
                        }
                    }
                }
                const allProducts = popup.querySelectorAll(".card-product")
                for (let i = 0; i < allProducts.length; i++) {
                    allProducts[i].addEventListener('click', (event) => {
                        a.querySelector(".name-product").innerHTML = allProducts[i].querySelector("#name").innerHTML
                        a.querySelector(".fam-product").innerHTML = allProducts[i].querySelector("#fam").innerHTML
                        a.querySelector(".ref-product").innerHTML = allProducts[i].querySelector("#ref").innerHTML

                        let price = parseFloat(allProducts[i].querySelector("#pvp").innerHTML.slice(0, -1));
                        let netprice = price*(100-discount.value)/100;
                        let quantity;
                        let netpriceBofill;
                        let difAbs;
                        let difPer;
                        const productes = document.getElementById("Bofill").querySelectorAll(".product-card")
                        for (let i = 0; i < productes.length; i++) {
                            if(productes[i].id == a.id){
                                netpriceBofill = productes[i].querySelector(".netprice-product")
                                quantity = productes[i].querySelector(".quantity-product").value
                                productes[i].querySelector(".quantity-product").addEventListener('change', (event) => {
                                    quantity = productes[i].querySelector(".quantity-product").value
                                    a.querySelector(".pvp-product").innerHTML = `${(price*quantity).toLocaleString('es-ES', numberOptions)}¤`
                                    a.querySelector(".netprice-product").innerHTML = `${(netprice*quantity).toLocaleString('es-ES', numberOptions)}¤`
                                    console.log("quantitat")
                                    console.log(quantity)
                                    difAbs = (quantity*netprice)-parseFloat(netpriceBofill.innerHTML.slice(0,-1));
                                    difPer = difAbs/parseFloat(netpriceBofill.innerHTML.slice(0,-1))*100;
                                    if(difAbs >=0 ){
                                        a.querySelector(".difference-absolute").innerHTML = `+${difAbs.toFixed(1)}¤`
                                        a.querySelector(".difference-percentatge").innerHTML = `+${difPer.toFixed(1)}%`
                                        a.querySelector(".difference-absolute").style.color = "#980a0a"
                                        a.querySelector(".difference-percentatge").style.color = "#980a0a"
                                    }else{
                                        a.querySelector(".difference-absolute").innerHTML = `${difAbs.toFixed(1)}¤`
                                        a.querySelector(".difference-percentatge").innerHTML = `${difPer.toFixed(1)}%`
                                        a.querySelector(".difference-absolute").style.color = "#0f890c"
                                        a.querySelector(".difference-percentatge").style.color = "#0f890c"
                                    }
                                });
                            }
                        }
                        a.querySelector(".ppu-product").innerHTML = `${price.toLocaleString('es-ES', numberOptions)}¤/u`
                        a.querySelector(".pvp-product").innerHTML = `${(price*quantity).toLocaleString('es-ES', numberOptions)}¤`

                        discount.addEventListener('change', (event) => {
                            netprice = price*(100-discount.value)/100
                            a.querySelector(".ppu-netprice-product").innerHTML = `${netprice.toLocaleString('es-ES', numberOptions)}¤/u`
                            a.querySelector(".netprice-product").innerHTML = `${(netprice*quantity).toLocaleString('es-ES', numberOptions)}¤`
                            difAbs = (quantity*netprice)-parseFloat(netpriceBofill.innerHTML.slice(0,-1));
                            difPer = difAbs/parseFloat(netpriceBofill.innerHTML.slice(0,-1))*100;
                            console.log("discount")
                            console.log(difAbs,difPer)
                            if(difAbs >=0 ){
                                a.querySelector(".difference-absolute").innerHTML = `+${difAbs.toFixed(1)}¤`
                                a.querySelector(".difference-percentatge").innerHTML = `+${difPer.toFixed(1)}%`
                                a.querySelector(".difference-absolute").style.color = "#980a0a"
                                a.querySelector(".difference-percentatge").style.color = "#980a0a"
                            }else{
                                a.querySelector(".difference-absolute").innerHTML = `${difAbs.toFixed(1)}¤`
                                a.querySelector(".difference-percentatge").innerHTML = `${difPer.toFixed(1)}%`
                                a.querySelector(".difference-absolute").style.color = "#0f890c"
                                a.querySelector(".difference-percentatge").style.color = "#0f890c"
                            }
                        });

                        document.getElementById('discount-bofill').addEventListener('change', (event) => {
                            difAbs = (quantity*netprice)-parseFloat(netpriceBofill.innerHTML.slice(0,-1));
                            difPer = difAbs/parseFloat(netpriceBofill.innerHTML.slice(0,-1))*100;
                            if(difAbs >=0 ){
                                a.querySelector(".difference-absolute").innerHTML = `+${difAbs.toFixed(1)}¤`
                                a.querySelector(".difference-percentatge").innerHTML = `+${difPer.toFixed(1)}%`
                                a.querySelector(".difference-absolute").style.color = "#980a0a"
                                a.querySelector(".difference-percentatge").style.color = "#980a0a"
                            }else{
                                a.querySelector(".difference-absolute").innerHTML = `${difAbs.toFixed(1)}¤`
                                a.querySelector(".difference-percentatge").innerHTML = `${difPer.toFixed(1)}%`
                                a.querySelector(".difference-absolute").style.color = "#0f890c"
                                a.querySelector(".difference-percentatge").style.color = "#0f890c"
                            }
                        });

                        difAbs = (quantity*netprice)-parseFloat(netpriceBofill.innerHTML.slice(0,-1));
                        difPer = difAbs/parseFloat(netpriceBofill.innerHTML.slice(0,-1))*100;
                        if(difAbs >=0 ){
                            a.querySelector(".difference-absolute").innerHTML = `+${difAbs.toFixed(1)}¤`
                            a.querySelector(".difference-percentatge").innerHTML = `+${difPer.toFixed(1)}%`
                            a.querySelector(".difference-absolute").style.color = "#980a0a"
                            a.querySelector(".difference-percentatge").style.color = "#980a0a"
                        }else{
                            a.querySelector(".difference-absolute").innerHTML = `${difAbs.toFixed(1)}¤`
                            a.querySelector(".difference-percentatge").innerHTML = `${difPer.toFixed(1)}%`
                            a.querySelector(".difference-absolute").style.color = "#0f890c"
                            a.querySelector(".difference-percentatge").style.color = "#0f890c"
                        }

                        a.querySelector(".ppu-netprice-product").innerHTML = `${netprice.toLocaleString('es-ES', numberOptions)}¤/u`
                        a.querySelector(".netprice-product").innerHTML = `${(netprice*quantity).toLocaleString('es-ES', numberOptions)}¤`
                        popup.style.visibility = "hidden";
                    });
                }
                addEventCLickProducts()
            }

            function searchByNAME(name){
                console.log(name)
                popup.querySelector(".products-created").style.display = "none";
                popup.querySelector("hr").style.display = "none";
                if(name == ""){
                    addFirstElements();
                    popup.querySelector(".products-created").style.display = "flex";
                    popup.querySelector("hr").style.display = "block";
                }else{
                    removeElements()
                    for (let i = 0; i < names.length; i++) {
                        if((names[i].toString()).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(name.toString().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))){
                            addElements(i)
                        }
                    }
                }
                addEventCLickProducts();
            }

            function searchByFILTRE(){
                removeElements();
                popup.querySelector(".products-created").style.display = "none";
                popup.querySelector("hr").style.display = "none";
                
                if(haveFamily && haveSubfamily && popup.querySelector("#filtre-subfamilia").value != ""){
                    let searchedFam = popup.querySelector("#filtre-familia").value
                    let searchedSubfam = popup.querySelector("#filtre-subfamilia").value
                    for (let i = 0; i < families.length; i++) {
                        if(families[i] == searchedFam && subfamilies[i] == searchedSubfam){
                            if(haveDiameter && popup.querySelector("#filtre-diametro").value != ""){
                                if(diameters[i] == popup.querySelector("#filtre-diametro").value){
                                    addElements(i);
                                }
                            }else{
                                addElements(i);
                            }
                        }
                    }
                }else if(haveFamily && popup.querySelector("#filtre-familia").value != ""){
                    let searchedFam = popup.querySelector("#filtre-familia").value
                    for (let i = 0; i < families.length; i++) {
                        if(families[i] == searchedFam){
                            if((haveInletdiameter || haveOutletdiameter || haveDiameter) && popup.querySelector("#filtre-diametro").value != ""){
                                console.log("entra aqui???")
                                if(diameters[i] == popup.querySelector("#filtre-diametro").value){
                                    addElements(i);
                                }
                            }else{
                                addElements(i);
                            }
                        }
                    }
                }
                addEventCLickProducts()
            }

            function deleteFilters(){
                addFirstElements();
                popup.querySelector(".products-created").style.display = "flex";
                popup.querySelector("hr").style.display = "block";

                let a = popup.querySelectorAll(".filtre")
                for (let i = 0; i < a.length; i++) {
                    a[i].style.borderWidth = "1px"
                }
                let inputs = popup.querySelector(".popup-filtre-competitor").querySelectorAll("input")
                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].value = "";
                }
            }

            function addFirstElements(){
                removeElements()
                for (let index = 2; index < 104; index++) {
                    addElements(index)
                }
                addEventCLickProducts();
            }

            function OpenPopupCreate(e){
                const Content = `
                <div class="popup-card" style="width: 500px;height: auto; position: relative; display: flex; justify-content: center; align-items: center;flex-direction: column; ">
                    <h3 style="position: absolute;top: 20px;left: 20px;">CREAR PRODUCTO</h3>
                    <button id="close-popup-create" onclick="closePopupCreate()" style="right: 20px;top: 20px;" class="cross">
                        <span style="transform: translateX(-50%) rotate(45deg);" class="cross-X"></span>
                        <span style="transform: translateX(-50%) rotate(-45deg);" class="cross-Y"></span>
                    </button>
    
                        <div class="input-container" style="margin-top: 85px;">
                            <input type="text" id="create-name" name="name" class="input">
                            <label id="name-label" for="">NOMBRE</label>
                            <span>NOMBRE</span>
                        </div>
                        <div class="input-container">
                            <textarea class="input" name="description" id="create-description" style="height: 100px;
                            resize: vertical;
                            overflow: auto;min-height:50px;max-height:205px;"></textarea>
                            <label id="description-label" for="">DESCRIPCIÓN</label>
                            <span>DESCRIPCIÓN</span>
                        </div>
                        <div class="input-container">
                            <input id="create-ean" type="text" name="ean" class="input">
                            <label for="">CÓDIGO EAN</label>
                            <span>CÓDIGO EAN</span>
                        </div>
                        <div class="input-container">
                            <input id="create-reference" type="text" name="reference" class="input">
                            <label for="">REFERENCIA</label>
                            <span>REFERENCIA</span>
                        </div>
                        
                        <div class="input-container">
                            <input id="create-family" type="text" name="family" class="input">
                            <label for="">FAMILIA</label>
                            <span>FAMILIA</span>
                        </div>
                        <div class="input-container">
                            <input id="create-subfamily" type="text" name="subfamily" class="input">
                            <label for="">SUBFAMILIA</label>
                            <span>SUBFAMILIA</span>
                        </div>
                        <div class="input-container">
                            <input id="create-diameter" type="text" name="diameter" class="input">
                            <label for="">DIÁMETRO</label>
                            <span>DIÁMETRO</span>
                        </div>
                        <div class="input-container">
                            <input id="create-price" type="number" name="price" class="input">
                            <label for="">PRECIO PVP</label>
                            <span>PRECIO PVP</span>
                        </div>
                    <button id="button-create-product" style="margin: 20px;width: 80%;outline: none;border: 1px solid black;background: #ebebeb;padding: 0.6rem 1.2rem;color: #105378;font-weight: bold;font-size: 0.95rem;letter-spacing: 0.5px;border-radius: 25px;cursor: pointer;font-family: 'Gotham-title';">
                        CREAR
                    </button>
                </div>
            `
            const popupCreate = document.createElement("div")
            popupCreate.classList.add("popup")
            popupCreate.style.zIndex = 200;
            popupCreate.style.visibility = "visible";
            popupCreate.innerHTML = Content;
            const inputs = popupCreate.querySelectorAll(".input");

            inputs.forEach((input) => {
                input.addEventListener("focus", focusFunc);
                input.addEventListener("blur", blurFunc);
            });

            document.getElementById("page").appendChild(popupCreate)

            popupCreate.querySelector("#close-popup-create").addEventListener('click', (event) => {
                popupCreate.remove()
            });

            popupCreate.querySelector("#button-create-product").addEventListener('click', (event) => {
                if(popupCreate.querySelector("#create-price").value == ""){
                    popupCreate.querySelector("#create-price").style.borderColor = "red";
                    popupCreate.querySelector("#create-price").style.backgroundColor = "#ff000029";
                }else{
                    const Content = `
                        <button id="delete-product" style="right: 5px;top: 5px;height:20px;width:20px;" class="cross">
                            <span style="transform: translateX(-50%) rotate(45deg);width: 1em;" class="cross-X"></span>
                            <span style="transform: translateX(-50%) rotate(-45deg);width: 1em;" class="cross-Y"></span>
                        </button>
                        <p id="fam" style="font-size:15px">${popupCreate.querySelector("#create-family").value}</p>
                        <p id="sfam" style="font-size:10px">${popupCreate.querySelector("#create-subfamily").value}</p>
                        <h5 id="name" style="font-size: 20px;">${popupCreate.querySelector("#create-name").value}</h5>
                        <p id="desc" style="font-size: 10px;">${popupCreate.querySelector("#create-description").value}</p>
                        <p id="pvp" style="font-size: 25px; margin-top:10px;margin-bottom:20px">${popupCreate.querySelector("#create-price").value}¤</p>
                        <p id="ref" style="font-size: 12px;left: 10px;position:absolute; bottom:7px;">${popupCreate.querySelector("#create-reference").value}</p>
                        <p id="diam" style="font-size: 12px;right: 10px;position:absolute; bottom:7px;">Ø${popupCreate.querySelector("#create-diameter").value}</p>
                        <p id="ean" style="display:none;">${popupCreate.querySelector("#create-ean")}</p>
                    `
                    const element = document.createElement("div")
                    element.classList.add("card-product")
                    element.style.height = "auto"
                    element.innerHTML = Content
                    popup.querySelector(".products-created").appendChild(element)

                    element.querySelector("#delete-product").addEventListener('click', (event) => {
                        element.remove()
                    });

                    popupCreate.remove();
                    popup.querySelector(".products-created").querySelector(".card-create-product").style.display = "none";
                    saveToStorage("productsCreated",popup.querySelector(".products-created").innerHTML)
                    console.log("productsCreated",popup.querySelector(".products-created").innerHTML)
                    popup.querySelector(".products-created").querySelector(".card-create-product").style.display = "flex";
                }
            });
            }

            function editProduct(e){
                const y = popup.querySelector(".products-created").querySelectorAll(".card-product")

                for (let i = 0; i < y.length; i++) {
                    y[i].remove()
                }
                let storage = loadFromStorage("productsCreated");
                if(storage == undefined) storage = "";
                console.log("this is storage", storage)
                popup.querySelector(".products-created").innerHTML += storage
                popup.querySelector("hr").style.display = "block";
                popup.querySelector(".products-created").style.display = "flex";

                const productsStoraged = popup.querySelector(".products-created").querySelectorAll(".card-product");

                for (let i = 0; i < productsStoraged.length; i++) {
                    console.log("hola?",productsStoraged[i].querySelector("#delete-product"))
                    productsStoraged[i].querySelector("#delete-product").addEventListener("click", (event) => {
                        productsStoraged[i].remove()
                        popup.querySelector(".products-created").querySelector(".card-create-product").style.display = "none";
                        saveToStorage("productsCreated",popup.querySelector(".products-created").innerHTML)
                        console.log("productsCreated",popup.querySelector(".products-created").innerHTML)
                        popup.querySelector(".products-created").querySelector(".card-create-product").style.display = "flex";
                    });
                }
                
                popup.style.visibility = "visible";

                popup.querySelector(".add").addEventListener('click', (event) => {
                    OpenPopupCreate(e);
                });

                addFirstElements()

                productEdit = e.target
                addEventCLickProducts()
            }

            function addEventCLickProducts(){
                const allProducts = popup.querySelector(".products-competitor").querySelectorAll(".card-product")
                for (let i = 0; i < allProducts.length; i++) {
                    allProducts[i].addEventListener('click', (event) => {
                        productEdit.closest(".product-card").querySelector(".name-product").innerHTML = allProducts[i].querySelector("#name").innerHTML
                        productEdit.closest(".product-card").querySelector(".fam-product").innerHTML = allProducts[i].querySelector("#fam").innerHTML
                        productEdit.closest(".product-card").querySelector(".ref-product").innerHTML = allProducts[i].querySelector("#ref").innerHTML

                        let price = parseFloat(allProducts[i].querySelector("#pvp").innerHTML.slice(0, -1));
                        let netprice = price*(100-discount.value)/100;
                        let quantity;
                        let netpriceBofill;
                        let difAbs;
                        let difPer;
                        const productes = document.getElementById("Bofill").querySelectorAll(".product-card")
                        for (let i = 0; i < productes.length; i++) {
                            if(productes[i].id == productEdit.closest(".product-card").id){
                                netpriceBofill = productes[i].querySelector(".netprice-product")
                                quantity = productes[i].querySelector(".quantity-product").value
                                productes[i].querySelector(".quantity-product").addEventListener('change', (event) => {
                                    quantity = productes[i].querySelector(".quantity-product").value
                                    productEdit.closest(".product-card").querySelector(".pvp-product").innerHTML = `${(price*quantity).toLocaleString('es-ES', numberOptions)}¤`
                                    productEdit.closest(".product-card").querySelector(".netprice-product").innerHTML = `${(netprice*quantity).toLocaleString('es-ES', numberOptions)}¤`
                                    console.log("quantitat")
                                    console.log(quantity)
                                    difAbs = (quantity*netprice)-parseFloat(netpriceBofill.innerHTML.slice(0,-1));
                                    difPer = difAbs/parseFloat(netpriceBofill.innerHTML.slice(0,-1))*100;
                                    if(difAbs >=0 ){
                                        productEdit.closest(".product-card").querySelector(".difference-absolute").innerHTML = `+${difAbs.toFixed(1)}¤`
                                        productEdit.closest(".product-card").querySelector(".difference-percentatge").innerHTML = `+${difPer.toFixed(1)}%`
                                        productEdit.closest(".product-card").querySelector(".difference-absolute").style.color = "#980a0a"
                                        productEdit.closest(".product-card").querySelector(".difference-percentatge").style.color = "#980a0a"
                                    }else{
                                        productEdit.closest(".product-card").querySelector(".difference-absolute").innerHTML = `${difAbs.toFixed(1)}¤`
                                        productEdit.closest(".product-card").querySelector(".difference-percentatge").innerHTML = `${difPer.toFixed(1)}%`
                                        productEdit.closest(".product-card").querySelector(".difference-absolute").style.color = "#0f890c"
                                        productEdit.closest(".product-card").querySelector(".difference-percentatge").style.color = "#0f890c"
                                    }
                                });
                            }
                        }
                        productEdit.closest(".product-card").querySelector(".ppu-product").innerHTML = `${price.toLocaleString('es-ES', numberOptions)}¤/u`
                        productEdit.closest(".product-card").querySelector(".pvp-product").innerHTML = `${(price*quantity).toLocaleString('es-ES', numberOptions)}¤`

                        discount.addEventListener('change', (event) => {
                            netprice = price*(100-discount.value)/100
                            productEdit.closest(".product-card").querySelector(".ppu-netprice-product").innerHTML = `${netprice.toLocaleString('es-ES', numberOptions)}¤/u`
                            productEdit.closest(".product-card").querySelector(".netprice-product").innerHTML = `${(netprice*quantity).toLocaleString('es-ES', numberOptions)}¤`
                            difAbs = (quantity*netprice)-parseFloat(netpriceBofill.innerHTML.slice(0,-1));
                            difPer = difAbs/parseFloat(netpriceBofill.innerHTML.slice(0,-1))*100;
                            console.log("discount")
                            console.log(difAbs,difPer)
                            if(difAbs >=0 ){
                                productEdit.closest(".product-card").querySelector(".difference-absolute").innerHTML = `+${difAbs.toFixed(1)}¤`
                                productEdit.closest(".product-card").querySelector(".difference-percentatge").innerHTML = `+${difPer.toFixed(1)}%`
                                productEdit.closest(".product-card").querySelector(".difference-absolute").style.color = "#980a0a"
                                productEdit.closest(".product-card").querySelector(".difference-percentatge").style.color = "#980a0a"
                            }else{
                                productEdit.closest(".product-card").querySelector(".difference-absolute").innerHTML = `${difAbs.toFixed(1)}¤`
                                productEdit.closest(".product-card").querySelector(".difference-percentatge").innerHTML = `${difPer.toFixed(1)}%`
                                productEdit.closest(".product-card").querySelector(".difference-absolute").style.color = "#0f890c"
                                productEdit.closest(".product-card").querySelector(".difference-percentatge").style.color = "#0f890c"
                            }
                        });

                        document.getElementById('discount-bofill').addEventListener('change', (event) => {
                            difAbs = (quantity*netprice)-parseFloat(netpriceBofill.innerHTML.slice(0,-1));
                            difPer = difAbs/parseFloat(netpriceBofill.innerHTML.slice(0,-1))*100;
                            if(difAbs >=0 ){
                                productEdit.closest(".product-card").querySelector(".difference-absolute").innerHTML = `+${difAbs.toFixed(1)}¤`
                                productEdit.closest(".product-card").querySelector(".difference-percentatge").innerHTML = `+${difPer.toFixed(1)}%`
                                productEdit.closest(".product-card").querySelector(".difference-absolute").style.color = "#980a0a"
                                productEdit.closest(".product-card").querySelector(".difference-percentatge").style.color = "#980a0a"
                            }else{
                                productEdit.closest(".product-card").querySelector(".difference-absolute").innerHTML = `${difAbs.toFixed(1)}¤`
                                productEdit.closest(".product-card").querySelector(".difference-percentatge").innerHTML = `${difPer.toFixed(1)}%`
                                productEdit.closest(".product-card").querySelector(".difference-absolute").style.color = "#0f890c"
                                productEdit.closest(".product-card").querySelector(".difference-percentatge").style.color = "#0f890c"
                            }
                        });

                        difAbs = (quantity*netprice)-parseFloat(netpriceBofill.innerHTML.slice(0,-1));
                        difPer = difAbs/parseFloat(netpriceBofill.innerHTML.slice(0,-1))*100;
                        if(difAbs >=0 ){
                            productEdit.closest(".product-card").querySelector(".difference-absolute").innerHTML = `+${difAbs.toFixed(1)}¤`
                            productEdit.closest(".product-card").querySelector(".difference-percentatge").innerHTML = `+${difPer.toFixed(1)}%`
                            productEdit.closest(".product-card").querySelector(".difference-absolute").style.color = "#980a0a"
                            productEdit.closest(".product-card").querySelector(".difference-percentatge").style.color = "#980a0a"
                        }else{
                            productEdit.closest(".product-card").querySelector(".difference-absolute").innerHTML = `${difAbs.toFixed(1)}¤`
                            productEdit.closest(".product-card").querySelector(".difference-percentatge").innerHTML = `${difPer.toFixed(1)}%`
                            productEdit.closest(".product-card").querySelector(".difference-absolute").style.color = "#0f890c"
                            productEdit.closest(".product-card").querySelector(".difference-percentatge").style.color = "#0f890c"
                        }

                        productEdit.closest(".product-card").querySelector(".ppu-netprice-product").innerHTML = `${netprice.toLocaleString('es-ES', numberOptions)}¤/u`
                        productEdit.closest(".product-card").querySelector(".netprice-product").innerHTML = `${(netprice*quantity).toLocaleString('es-ES', numberOptions)}¤`
                        popup.style.visibility = "hidden";
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
                const ContentProduct = `
                            <div style="height: 100%;width: auto; align-items: center; display: flex;margin-left:10px; max-width:calc(100% - 320px); overflow-x:hidden;">
                                <div>
                                    <h5 class="fam-product">FAMILIA</h5>
                                    <h4 class="name-product">NOMBRE</h4>
                                    <p class="ref-product">CÓDIGO</p>
                                </div>
                            </div>
                            <button class="edit-product-competitor">
                                    <img loading="lazy" src="./img/edit.svg" style="height: 30px; width: 30px;" onerror="this.onerror=null; this.src='https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg';" alt="">
                                </button>
                            <div style="width: 70px;position: absolute;right: 10px;bottom:17px;display:flex;justify-content:center;flex-direction:column;align-items:center;">
                                <h4 id="" style="font-size:15px;color:#980a0a;" class="difference-percentatge">+XX,X%</h4>
                                <h4 id="" style="font-size:15px;color:#980a0a;" class="difference-absolute">+XX,X¤</h4>
                            </div>
                            <div style="height: 120px;width: 150px;position: absolute;right: 80px;">
                                <h4 id="price" class="pvp-product">XX.XX¤</h4>
                                <p id="price-unit" class="ppu-product">XX.XX¤/u</p>
                                <h4 id="netprice" class="netprice-product">XX.XX¤</h4>
                                <p id="price-unit-netprice" style="right:27px" class="ppu-netprice-product">XX.XX¤/u</p>
                            </div>
                            <div style="height: 120px;width: 35px;position: absolute;right: 230px;">
                                
                                <p id="price-unit" class="ppu-product" style="
    left: 0px;
    top: 30px;
">pvp:</p>
                                
                                <p id="price-unit-netprice" style="left: 0px;bottom: 23px;" class="ppu-netprice-product">neto:</p>
                            </div>
                `
                card_product.addEventListener('mouseover', changeColor);
                card_product.addEventListener('mouseout', changeColor);
                card_product.innerHTML = ContentProduct;
                a.querySelector(".products-container").append(card_product)
                card_product.querySelector(".edit-product-competitor").addEventListener("click", editProduct)
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
    console.log("SAVE WINDOW")
    let windowsBefore = loadFromStorage("windows")
    if(windowsBefore == undefined) windowsBefore = [];
    let arrayCompetitors = [];
    let cardCompetitors = document.querySelectorAll(".card-container")
    for (let i = 0; i < cardCompetitors.length; i++) {
        if(cardCompetitors[i].id != "Bofill"){
            let competitorName = cardCompetitors[i].querySelector(".select-competitor").value
            console.log("competitorName:",competitorName)
            let competitorContent = cardCompetitors[i].querySelector(".products-container").innerHTML
            let competitorDiscount = cardCompetitors[i].querySelector(".input-discount").value

            arrayCompetitors.push({name: competitorName, content: competitorContent, discount: competitorDiscount})
        }
    }
    for (let i = 0; i < windowsBefore.length; i++) {
        if(windowsBefore[i].name == windowName){
            windowsBefore.splice(i,1);
        }
    }
    let discountBofill = document.querySelector("#discount-bofill").value
    let contentBofill = document.querySelector("#Bofill").querySelector(".products-container").innerHTML
    windowsBefore.push({name: windowName, bofill:{discount: discountBofill, content: contentBofill}, competitors:arrayCompetitors})
    saveToStorage("windows", windowsBefore)
    console.log(windowsBefore)
    renderWindows()
}

function cleanWindow(){
    let allWindows = this.document.querySelectorAll(".windows-click")
    for (let i = 0; i < allWindows.length; i++) {
        allWindows[i].style.backgroundColor = "white";
    }
    windowName = createName()
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

function renderWindows(){
    console.log("RENDER WINDOWS")
    let windows = loadFromStorage("windows")
    if(windows == undefined) windows = [];
    console.log(windows)
    document.querySelector(".windows-elements").innerHTML = "";

    for (let i = 0; i < windows.length; i++) {
        
        const Content = `
            <h3 style="margin-top:20px;margin-left:15px;margin-right: 15px;">${windows[i].name}</h3>
        `
        const div = document.createElement("div")
        div.classList.add("windows-click")
        div.innerHTML = Content;
        if(windows[i].name == windowName) div.style.backgroundColor = "#b2b2b2";
        document.querySelector(".windows-elements").appendChild(div);
        div.addEventListener("click", (event) => {
            cleanWindow();
            event.target.closest(".windows-click").style.backgroundColor = "#b2b2b2";
            windowName = windows[i].name
            this.document.querySelector("#discount-bofill").value = windows[i].bofill.discount
            this.document.querySelector("#Bofill").querySelector(".products-container").innerHTML = windows[i].bofill.content
            id_product = windows[i].id_product
            for (let j = 0; j < windows[i].competitors.length; j++) {
                let competitor = addCompetitor(windows[i].competitors[j].name)
                competitor.querySelector(".input-discount").value = windows[i].competitors[j].discount
                getCompetitor(competitor,false)
                competitor.querySelector(".products-container").innerHTML = windows[i].competitors[j].content
            }
        });
    }
}

window.addEventListener("load", function () {
    fetch('../config.json')
        .then((response) => response.json())
        .then((config) => {
            const files = Object.entries(config);
            competitors = files
            competitorsJSON = config
    });

    fetch('../filters.json')
        .then((response) => response.json())
        .then((f) => {
            const file = Object.entries(f);
            filtersJSON = f
    });

    renderWindows();

    const fileUrl = '../bofill.xlsx';

fetch(fileUrl)
    .then(response => response.arrayBuffer())
    .then(data => {

        document.getElementById("div-referencia").addEventListener("click", searchByREF)

        const columnImage = competitorsJSON["bofill"].imgName;
        const columnName = competitorsJSON["bofill"].name
        const columnDescription = competitorsJSON["bofill"].description;
        const columnEanCode = competitorsJSON["bofill"].eanCode;
        const columnReference = competitorsJSON["bofill"].reference;
        const columnPvp = competitorsJSON["bofill"].pvp;
        const columnFamily = competitorsJSON["bofill"].family;
        const columnSubfamily = competitorsJSON["bofill"].subfamily;
        const columnDiameter = competitorsJSON["bofill"].diameter;
        const columnInletDiameter = competitorsJSON["bofill"].inletDiameter;
        const columnOutletDiameter = competitorsJSON["bofill"].outletDiameter;

        let workbook;
        let firstSheetName;
        let worksheet;
        let range

        const worker = new Worker('./scripts/worker.js');
            worker.postMessage(data);
            worker.onmessage = function (e) {
                workbook = e.data;
                firstSheetName = workbook.SheetNames[0];
                worksheet = workbook.Sheets[firstSheetName];
                range = XLSX.utils.decode_range(worksheet['!ref']);
            };
            worker.onerror = function (error) {
                console.error('Worker error: ', error);
            };

            workbook = XLSX.read(data, { type: 'array' });
            firstSheetName = workbook.SheetNames[0];
            worksheet = workbook.Sheets[firstSheetName];
            range = XLSX.utils.decode_range(worksheet['!ref']);
            

        var colIndex;
        var cell;
        const products = [];

        for (let row = range.s.r+1; row <= range.e.r; row++) {

            colIndex = columnLetterToNumber(columnName);
            cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
            const Name = cell ? cell.v : ''

            colIndex = columnLetterToNumber(columnFamily);
            cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
            const Family = cell ? cell.v : ''

            colIndex = columnLetterToNumber(columnSubfamily);
            cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
            const Subfamily = cell ? cell.v : ''

            colIndex = columnLetterToNumber(columnReference);
            cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
            const Reference = cell ? cell.v : ''

            colIndex = columnLetterToNumber(columnEanCode);
            cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
            const Ean = cell ? cell.v : ''

            const Product = {
                name: Name,
                family: Family,
                subfamily: Subfamily,
                reference: Reference,
                ean: Ean
            }

            products.push(Product)

        }

        document.getElementById("filtre-categoria").addEventListener("change", getCategoria)
        document.getElementById("filtre-familia").addEventListener("change", getFamilia)
        //document.getElementById("filtre-subfamilia").addEventListener("change", getSubfamilia)
        //document.getElementById("filtre-diametro").addEventListener("change", getDiametro)

        
    
        function addElements(row) {
            var cellAddress = `${columnImage}${row}`;
            var desiredCell = worksheet[cellAddress];
            const cellContentIMAGE = desiredCell ? desiredCell.v : 'IMAGE';

            var cellAddress = `${columnName}${row}`;
            var desiredCell = worksheet[cellAddress];
            const cellContentNAME = desiredCell ? desiredCell.v : 'NAME';

            cellAddress = `${columnDescription}${row}`
            desiredCell = worksheet[cellAddress];
            const cellContentDESC = desiredCell ? desiredCell.v : 'DESCRIPTION';
            
            cellAddress = `${columnReference}${row}`
            desiredCell = worksheet[cellAddress];
            const cellContentREF = desiredCell ? desiredCell.v : 'REFERENCE';
            
            cellAddress = `${columnFamily}${row}`
            desiredCell = worksheet[cellAddress];
            const cellContentFAM = desiredCell ? desiredCell.v : 'FAMILY';
            
            cellAddress = `${columnSubfamily}${row}`
            desiredCell = worksheet[cellAddress];
            const cellContentSFAM = desiredCell ? desiredCell.v : 'SUBFAMILY';
            
            cellAddress = `${columnPvp}${row}`
            desiredCell = worksheet[cellAddress];
            const cellContentPVP = desiredCell ? desiredCell.v : 'PVP';
            
            cellAddress = `${columnEanCode}${row}`
            desiredCell = worksheet[cellAddress];
            const cellContentEAN = desiredCell ? desiredCell.v : 'EANCODE';

            cellAddress = `${columnDiameter}${row}`
            desiredCell = worksheet[cellAddress];
            const cellContentDIAMETER = desiredCell ? desiredCell.v : 'DIAMETER';

            cellAddress = `${columnInletDiameter}${row}`
            desiredCell = worksheet[cellAddress];
            const cellContentINLETDIAMETER = desiredCell ? desiredCell.v : 'INLETDIAMETER';

            cellAddress = `${columnOutletDiameter}${row}`
            desiredCell = worksheet[cellAddress];
            const cellContentOUTLETDIAMETER = desiredCell ? desiredCell.v : 'OUTLETDIAMETER';

            const element = document.createElement('div')
            const Content = `
            <img loading="lazy" src="./img/FOTOS ${cellContentFAM}/${cellContentIMAGE}.png" onerror="this.onerror=null; this.src='https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg';" alt="">
            <h5 id="name" style="font-size: 20px;white-space: nowrap;">${cellContentNAME}</h5>
            <p id="desc" style="font-size: 10px;margin-bottom: 20px;">${cellContentDESC}</p>
            <p id="ref" style="font-size: 10px;left: 10px;position:absolute; bottom:7px;">${cellContentREF}</p>
            <p id="diam" style="font-size: 10px;right: 10px;position:absolute; bottom:7px;">Ø${cellContentDIAMETER}</p>
            <p id="fam" style="display:none;">${cellContentFAM}</p>
            <p id="sfam" style="display:none;">${cellContentSFAM}</p>
            <p id="pvp" style="display:none;">${cellContentPVP}</p>
            <p id="ean" style="display:none;">${cellContentEAN}</p>
            `
            element.classList.add("card-product")
            element.innerHTML = Content
            element.addEventListener("click", addProduct);
            document.getElementById("products").appendChild(element)
        }

        function searchByREF(ref){
            if(ref == ""){
                addFirstElements();
                return;
            }
            for (let i = 0; i < products.length; i++) {
                if((products[i].reference.toString()).startsWith(ref.toString())){
                    addElements(i+2)
                }
            }
        }

        function searchByEAN(code){
            if(code == ""){
                addFirstElements();
                return;
            }
            for (let i = 0; i < products.length; i++) {
                if((products[i].ean.toString()).startsWith(code.toString())){
                    addElements(i+2)
                }
            }
        }

        function searchByNAME(name){
            if(name == ""){
                addFirstElements();
                return;
            }
            for (let i = 0; i < products.length; i++) {
                if((products[i].name.toString()).startsWith(name.toString().toUpperCase())){
                    addElements(i+2)
                }
            }
        }

        function searchByFILTRE(){
            let category = document.getElementById('filtre-categoria')
            let family = document.getElementById('filtre-familia')
            let subfamily = document.getElementById('filtre-subfamilia')
            let diameter = document.getElementById('filtre-diametro')
            if(subfamily.value != ""){
                removeElements()
                let subfamsShow = filtersJSON[category.value][family.value][subfamily.value]
                let famShow = family.value

                for (let i = 0; i < products.length; i++) {
                    if(products[i].family == famShow){
                        for (let j = 0; j < subfamsShow.length; j++) {
                            if(products[i].subfamily == subfamsShow[j]){
                                addElements(i+2);
                            }
                        }
                    }
                }
            }else if(family.value != ""){
                removeElements()
                let famShow = family.value
                for (let i = 2; i < products.length; i++) {
                    if(products[i].family == famShow){
                        addElements(i+2)
                    }
                }
            }else if(category.value != ""){
                removeElements()
                let famsShow = Object.entries(filtersJSON[category.value]);
                for (let i = 0; i < products.length; i++) {
                    for (let j = 0; j < famsShow.length; j++) {
                        if(products[i].family == famsShow[j][0]){
                            addElements(i+2)
                        }
                    }
                }
                
            }else{
                addFirstElements();
            }

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

            let categoryFamilies = Object.entries(filtersJSON[category.value]);

            for (let j = 0; j < categoryFamilies.length; j++) {
                const newOption = document.createElement('option');
                newOption.value = categoryFamilies[j][0];
                newOption.text = categoryFamilies[j][0];
                family.appendChild(newOption)
            }
        }

        function getFamilia(){
            let category = document.getElementById('filtre-categoria')
            let family = document.getElementById('filtre-familia')
            let subfamily = document.getElementById('filtre-subfamilia')

            let familySubfamily = Object.entries(filtersJSON[category.value][family.value]);

            subfamily.innerHTML = ""
            const newOption = document.createElement('option');
            newOption.value = "";
            newOption.text = "SUBFAMILIA";
            newOption.disabled = true;
            newOption.selected = true;
            subfamily.appendChild(newOption)

            for (let k = 0; k < familySubfamily.length; k++) {
                const newOption = document.createElement('option');
                newOption.value = familySubfamily[k][0].toUpperCase();
                newOption.text = familySubfamily[k][0].toUpperCase();
                subfamily.appendChild(newOption)
            }
        }

        function addFirstElements(){
            removeElements()
            for (let index = 2; index < 104; index++) {
                addElements(index)
            }
        }

        function removeElements() {
            document.getElementById("popup").querySelector("#products").innerHTML = "";
        }

        addFirstElements()

        function deleteFilters(){
            removeElements();
            addFirstElements();
            let a = document.querySelectorAll(".filtre")
            for (let i = 0; i < a.length; i++) {
                a[i].style.borderWidth = "1px"
            }
            document.getElementById("filtre-categoria").value = "";
            document.getElementById("filtre-familia").value = "";
            document.getElementById("filtre-subfamilia").value = "";
            document.getElementById("filtre-diametro").value = "";
            document.getElementById("referencia").value = "";
            document.getElementById("nombre").value = "";
            document.getElementById("codigoean").value = "";
        }

        function openPopup(name){
            if(name == "bofill"){
                removeElements()
                addFirstElements()
            }else{

            }
            document.getElementById("popup").style.visibility = "visible";
        }

        document.getElementById("referencia").addEventListener("change", (event) => {
          removeElements()
          searchByREF(document.getElementById("referencia").value)
        });
        document.getElementById("codigoean").addEventListener("change", (event) => {
          removeElements()
          searchByEAN(document.getElementById("codigoean").value)
        });
        document.getElementById("div-codigoean").addEventListener("click", (event) => {
          removeElements()
          searchByEAN(document.getElementById("codigoean").value)
        });
        document.getElementById("div-referencia").addEventListener("click", (event) => {
          removeElements()
          searchByREF(document.getElementById("referencia").value)
        });
        document.getElementById("div-filtre").addEventListener("click", (event) => {
          removeElements()
          searchByFILTRE()
        });
        document.getElementById("nombre").addEventListener("change", (event) => {
          removeElements()
          searchByNAME(document.getElementById("nombre").value)
        });
        document.getElementById("div-nombre").addEventListener("click", (event) => {
          removeElements()
          searchByNAME(document.getElementById("nombre").value)
        });
        document.getElementById("deleteFilters").addEventListener("click", (event) => {
          deleteFilters();
        });
        document.getElementById("button-add-product").addEventListener("click", (event) => {
            openPopup("bofill")
        });                
        document.getElementById("page").style.display = "block";
        document.getElementById("load").style.display = "none";
    })
    .catch(error => {
        console.error('Error al leer el archivo:', error);
        doError("NO S'HA TROBAT EXCEL DE BOFILL");
    });
    document.getElementById("page").style.display = "block";
        document.getElementById("load").style.display = "none";
    

    

    this.document.getElementById("discount-bofill").addEventListener("change", (event) => {
        let discount = document.getElementById("discount-bofill").value
        if(discount >= 100 || discount < 0){
            document.getElementById("discount-bofill").value = 0;
            discount = 0;
        }
        let a = this.document.getElementById("Bofill").querySelectorAll(".product-card")
        for (let i = 0; i < a.length; i++) {
            const priceunit = a[i].querySelector("#price-unit").innerHTML
            const price = (a[i].querySelector(".quantity-product").value * priceunit.substring(0, priceunit.length - 3));
            a[i].querySelector("#netprice").innerHTML = `${(price*(100-discount)/100).toLocaleString('es-ES', numberOptions)}¤`
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
        a[i].addEventListener("change", loadPrice);
    }

    

    
    
    /*setTimeout(() => {
        document.getElementById("page").style.display = "block";
        document.getElementById("load").style.display = "none";
    }, 5000);*/
    setInterval(saveWindow, 5000);
});

function imprimir() {
    closePopup()
    let a = document.querySelectorAll("button")
    for (let i = 0; i < a.length; i++) {
        a[i].style.display = "none"
    }
    
    a = document.querySelectorAll("input")
    for (let i = 0; i < a.length; i++) {
        a[i].disabled = true
    }

    a = document.querySelectorAll("select")
    for (let i = 0; i < a.length; i++) {
        a[i].disabled = true
    }
}