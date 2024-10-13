// Lista de los nombres de los archivos de las fuentes
const fuentes = [
    'gotham_black.otf',
//    'gotham_blackitalic.otf',
    'gotham_bold.otf',
//    'gotham_bolditalic.otf',
    'gotham_book.otf',
//    'gotham_bookitalic.otf',
    'gotham_light.otf',
//    'gotham_lightitalic.otf',
    'gotham_medium.otf',
//    'gotham_mediumitalic.otf',
    'gotham_thin.otf',
//    'gotham_thinitalic.otf',
    'gotham_ultra.otf',
//    'gotham_ultraitalic.otf',
    'gotham_xlight.otf',
//    'gotham_xlightitalic.otf',
/*    'gothamcond_black.otf',
    'gothamcond_blackitalic.otf',
    'gothamcond_bold.otf',
    'gothamcond_bolditalic.otf',
    'gothamcond_book.otf',
    'gothamcond_bookitalic.otf',
    'gothamcond_light.otf',
    'gothamcond_lightitalic.otf',
    'gothamcond_medium.otf',
    'gothamcond_mediumitalic.otf',
    'gothamcond_thin.otf',
    'gothamcond_thinitalic.otf',
    'gothamcond_ultra.otf',
    'gothamcond_ultraitalic.otf',
    'gothamcond_xblack.otf',
    'gothamcond_xblackitalic.otf',
    'gothamcond_xlight.otf',
    'gothamcond_xlightitalic.otf',
    'gothamnarrow_black.otf',
    'gothamnarrow_blackitalic.otf',
    'gothamnarrow_bolditalic.otf',
    'gothamnarrow_bookitalic.otf',
    'gothamnarrow_medium.otf',
    'gothamnarrow_thin.otf',
    'gothamnarrow_thinitalic.otf',
    'gothamnarrow_ultra.otf',
    'gothamnarrow_ultraitalic.otf',
    'gothamnarrow_xlightitalic.otf',
    'gothamxnarrow_black.otf',
    'gothamxnarrow_blackitalic.otf',
    'gothamxnarrow_bold.otf',
    'gothamxnarrow_bolditalic.otf',
    'gothamxnarrow_light.otf',
    'gothamxnarrow_lightitalic.otf',
    'gothamxnarrow_medium.otf',
    'gothamxnarrow_mediumitalic.otf',
    'gothamxnarrow_thin.otf',
    'gothamxnarrow_thinitalic.otf',
    'gothamxnarrow_ultra.otf',
    'gothamxnarrow_ultraitalic.otf',
    'gothamxnarrow_xlight.otf',
    'gothamxnarrow_xlightitalic.otf'*/
  ];
  
  // Seleccionamos el contenedor donde irá el contenido
  const container = document.getElementById('fuentes-container');
  
  // Seleccionamos el elemento donde inyectaremos los estilos CSS
  const styleElement = document.getElementById('dynamic-styles');
  let estilosCSS = '';
  
  // Función que genera un nombre de clase a partir del nombre del archivo
  const generarNombreClase = (nombreFuente) => {
    return nombreFuente.replace(/[\W_]+/g, '-').toLowerCase().replace(/\.(otf|ttf)$/, '');
  };
  
  // Recorremos la lista de fuentes para crear el HTML y el CSS dinámicamente
  fuentes.forEach((fuente) => {
    const nombreFuente = fuente.replace(/\.(otf|ttf)$/, ''); // Quitamos la extensión
    const claseFuente = generarNombreClase(fuente); // Generamos el nombre de clase
  
    // Creamos el bloque de HTML
    const bloqueHTML = `
      <div class="fuente">
        <p class="${claseFuente}">Aquest text està utilitzant ${nombreFuente}.</p>
      </div>
    `;
  
    // Agregamos el bloque al contenedor
    container.innerHTML += bloqueHTML;
  
    // Definimos el formato de la fuente
    const formato = fuente.endsWith('.otf') ? 'opentype' : 'truetype';
  
    // Creamos el CSS dinámico para cada fuente
    estilosCSS += `
      @font-face {
        font-family: '${nombreFuente}';
        src: url('./gotham/Gotham-Font/${fuente}') format('${formato}');
      }
  
      .${claseFuente} {
        font-family: '${nombreFuente}', sans-serif;
        font-size: 24px;
      }
    `;
  });
  
  // Inyectamos el CSS generado en el elemento <style>
  styleElement.textContent = estilosCSS;
  