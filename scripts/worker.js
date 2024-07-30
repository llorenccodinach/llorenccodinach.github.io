importScripts("./xlsx.full.min.js")

function columnLetterToNumber(columnLetter) {
    let columnNumber = 0;
    const length = columnLetter.length;
    for (let i = 0; i < length; i++) {
        columnNumber *= 26;
        columnNumber += columnLetter.charCodeAt(i) - ('A'.charCodeAt(0) - 1);
    }
    return columnNumber;
}

self.onmessage = function (e) {
    console.log("worker")
    const data = e.data;
    const workbook = XLSX.read(data.data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const range = XLSX.utils.decode_range(worksheet['!ref']);

    let diameters = [];
    let products = [];
    let colIndex;
    let cell;
    
    for (let row = range.s.r-1+data.startingRow; row <= range.e.r; row++) {
        let Name;
        if(data.columnName != "" && data.columnName != undefined){
            colIndex = columnLetterToNumber(data.columnName);
            cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
            Name = cell ? cell.v : ''
        }
        
        let Description;
        if(data.columnDescription != "" && data.columnDescription != undefined){
            colIndex = columnLetterToNumber(data.columnDescription);
            cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
            Description = cell ? cell.v : ''
        }

        let Pvp;
        if(data.columnPvp != "" && data.columnPvp != undefined){
            colIndex = columnLetterToNumber(data.columnPvp);
            cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
            Pvp = cell ? cell.v : ''
        }

        let Family;
        if(data.columnFamily != "" && data.columnFamily != undefined){
            colIndex = columnLetterToNumber(data.columnFamily);
            cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
            Family = cell ? cell.v : ''
        }

        let Subfamily;
        if(data.columnSubfamily != "" && data.columnSubfamily != undefined){
            colIndex = columnLetterToNumber(data.columnSubfamily);
            cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
            Subfamily = cell ? cell.v : ''
        }

        let Reference;
        if(data.columnReference != "" && data.columnReference != undefined){
            colIndex = columnLetterToNumber(data.columnReference);
            cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
            Reference = cell ? cell.v : ''
        }

        let Ean;
        if(data.columnEanCode != "" && data.columnEanCode != undefined){
            colIndex = columnLetterToNumber(data.columnEanCode);
            cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
            Ean = cell ? cell.v : ''
        }
        

        let Namefam;
        if(data.columnImage != "" && data.columnImage != undefined){
            colIndex = columnLetterToNumber(data.columnImage);
            cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
            Namefam = cell ? cell.v : '';
        }


        let AdditionalFamily1;
        if(data.columnAdditionalFamily1 != "" && data.columnAdditionalFamily1 != undefined){
            colIndex = columnLetterToNumber(data.columnAdditionalFamily1);
            cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
            AdditionalFamily1 = cell ? cell.v : '';
        }


        let AdditionalFamily2;
        if(data.columnAdditionalFamily2 != "" && data.columnAdditionalFamily2 != undefined){
            colIndex = columnLetterToNumber(data.columnAdditionalFamily2);
            cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
            AdditionalFamily2 = cell ? cell.v : '';
        }

        let AdditionalFamily3;
        if(data.columnAdditionalFamily3 != "" && data.columnAdditionalFamily3 != undefined){
            colIndex = columnLetterToNumber(data.columnAdditionalFamily3);
            cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
            AdditionalFamily3 = cell ? cell.v : '';
        }

        let AdditionalFamily4;
        if(data.columnAdditionalFamily4 != "" && data.columnAdditionalFamily4 != undefined){
            colIndex = columnLetterToNumber(data.columnAdditionalFamily4);
            cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
            AdditionalFamily4 = cell ? cell.v : '';
        }

        let AdditionalFamily5;
        if(data.columnAdditionalFamily5 != "" && data.columnAdditionalFamily5 != undefined){
            colIndex = columnLetterToNumber(data.columnAdditionalFamily5);
            cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
            AdditionalFamily5 = cell ? cell.v : '';
        }
        
        colIndex = columnLetterToNumber(data.columnDiameter)
        let colIndex2 = columnLetterToNumber(data.columnInletDiameter)
        let colIndex3 = columnLetterToNumber(data.columnOutletDiameter)
        const cell2 = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex2 - 1 })];
        const cell3 = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex3 - 1 })];
        cell = worksheet[XLSX.utils.encode_cell({ r: row, c: colIndex - 1 })];
        let Diameter;
        if((cell2 ? cell2.v : '') != '-' && (cell3 ? cell3.v : '') == '-'){
            if(cell2 ? cell2.v : '' != ""){
                Diameter = cell2 ? cell2.v : '';
                diameters.push(cell2 ? cell2.v : '')
            }
        }else if((cell3 ? cell3.v : '') != '-' && (cell2 ? cell2.v : '') == '-'){
            if(cell3 ? cell3.v : '' != ""){
                Diameter = cell3 ? cell3.v : '';
                diameters.push(cell3 ? cell3.v : '')
            }
        }else if((cell2 ? cell2.v : '') != (cell3 ? cell3.v : '') && (cell ? cell.v : '') != '-'){
            Diameter = `${cell2 ? cell2.v : ''}-${cell3 ? cell3.v : ''}`;
            diameters.push(`${cell2 ? cell2.v : ''}-${cell3 ? cell3.v : ''}`)
        }else if(cell ? cell.v : '' != ""){
            Diameter = cell ? cell.v : '';
            diameters.push(cell ? cell.v : '')
        }
        
        const Product = {
            name: Name,
            description:Description,
            family: Family,
            subfamily: Subfamily,
            reference: Reference,
            ean: Ean,
            diameter: Diameter,
            namefam: Namefam,
            pvp: Pvp,
            additionalFamily1: AdditionalFamily1,
            additionalFamily2: AdditionalFamily2,
            additionalFamily3: AdditionalFamily3,
            additionalFamily4: AdditionalFamily4,
            additionalFamily5: AdditionalFamily5
        }
        products.push(Product)
    }
    console.log(products)
    self.postMessage({diameters: diameters, products: products});
};