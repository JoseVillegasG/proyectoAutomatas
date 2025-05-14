let numeros = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

let letras = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

let caracteres = [
    '!', '#', '$', '%', '&', "'", '*', '+', '-', '/', '=',
    '?', '^', '_', '`', '{', '|', '}', '~', '.'
];
let guion = [' ','-'];



function leerArchivoTel(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
        return;
    }
    var lector = new FileReader();
    lector.onload = function (e) {
        var contenido = e.target.result;
        var telefonos = extraerTelefonos(contenido);

   
        crearArchivoTxt(telefonos, 'telefonosValidos.txt');
    };
    lector.readAsText(archivo);
}

function extraerTelefonos(texto) {
    let telefonos = [];
    let i = 0;

    while (i < texto.length) {
        let telefono = "";

        // Verificar si es un número con código de país
        if (texto[i] === '+') {
            telefono += texto[i]; // Agregar el +
            i++;
            let count = 0;

            while (count < 12 && i < texto.length && numeros.includes(texto[i])) {
                telefono += texto[i];
                count++;
                i++;
            }
        } else {
            let count = 0;
            while (count < 10 && i < texto.length && numeros.includes(texto[i])) {
                telefono += texto[i];
                count++;
                i++;
            }
        }

        // Si se formó un número válido, lo agregamos
        if ((telefono.startsWith('+') && telefono.length === 13) || telefono.length === 10) {
            telefonos.push(telefono);
        }
    }
    console.log(telefonos);
    return telefonos;
}




//document.getElementById('tel')
//    .addEventListener('change', leerArchivoTel, false);






let dominiosValidos = [
    ".com", ".net", ".org", ".edu", ".gov", ".mil", ".int", ".info", ".biz",
    ".name", ".pro", ".museum", ".coop", ".aero", ".tv", ".me", ".cc", ".io",
    ".tech", ".ai", ".dev", ".app", ".xyz", ".online", ".store", ".site",
    ".us", ".uk", ".ca", ".au", ".es", ".fr", ".de", ".it", ".jp", ".cn",
    ".in", ".br", ".mx", ".ar", ".ru", ".ch", ".nl", ".se", ".no", ".dk"
];

function leerArchivoEmail(e) {
    var archivo = e.target.files[0];
    if (!archivo) {
        return;
    }
    var lector = new FileReader();
    lector.onload = function (e) {
        var contenido = e.target.result;
        var emails = extraerEmails(contenido);


        crearArchivoTxt(emails, 'emailsValidos.txt');
    };
    lector.readAsText(archivo);
}

function extraerEmails(texto) {
    let emails = [];
    let i = 0;
    let correo = "";

    while (i < texto.length) {
      
        if (esCaracterValido(texto[i])) {
            correo += texto[i];
        }

        // Si el correo tiene una terminación válida, lo guardamos
        if (tieneDominioValido(correo)) {
            emails.push(correo);
            correo = ""; // Limpiar el correo para continuar buscando
        }

        i++;
    }
    console.log(emails);
    return emails;
}

function esCaracterValido(caracter) {

    let caracteresValidos = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '@', '_', '-', '+', '%'
    ];


    return caracteresValidos.includes(caracter);



}

function tieneDominioValido(correo) {
    return dominiosValidos.some(dominio => correo.endsWith(dominio));
}



//document.getElementById('email')
//    .addEventListener('change', leerArchivoEmail, false);




function leerArchivoDesdeURL() {

    var url = $('#urlEmail').val();

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el archivo.');
            }
            return response.text();
        })
        .then(contenido => {

            var emails = extraerEmails(contenido);

          
            crearArchivoTxt(emails, 'emailsValidos.txt');
        })
        .catch(error => {
            console.error('Hubo un problema al obtener el archivo: ', error);
        });
}



function leerArchivoDesdeURLTel() {

    var url = $('#urlTel').val();


    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el archivo.');
            }
            return response.text();
        })
        .then(contenido => {
            var telefonos = extraerTelefonos(contenido);

          crearArchivoTxt(telefonos, 'telefonosValidos.txt');
        })
        .catch(error => {
            console.error('Hubo un problema al obtener el archivo: ', error);
        });
}

function archivoTel() {
    const input = $("#tel").val();
    leerArchivoTel(input);
}
function archivoEmaill() {
    const input = $("#email").val();
    leerArchivoEmail(input);
}

//automata de emails
function ValidarEmail(input) {
   
    let state = 0;
    let contador = 0;

    while (contador < input.length) {
        let char = input[contador];

        switch (state) {
            case 0:
                if (letras.includes(char)) {
                    state = 1;
                } else {
                    return false;
                }
                break;

            case 1:
                if (numeros.includes(char)) {
                    state = 2;
                } else if (letras.includes(char)) {
                    state = 3;
                } else if (caracteres.includes(char)) {
                    state = 4;
                } else {
                    return false;
                }
                break;

            case 2:
            case 3:
            case 4:
                if (numeros.includes(char)) {
                    state = 2;
                } else if (letras.includes(char)) {
                    state = 3;
                } else if (caracteres.includes(char)) {
                    state = 4;
                } else if (char === '@') {
                    state = 5;
                } else {
                    return false;
                }
                break;

            case 5:
                if (numeros.includes(char)) {
                    state = 5;
                } else if (letras.includes(char)) {
                    state = 6;
                } else if (char === '.') {
                    state = 7;
                } else {
                    return false;
                }
                break;

            case 6:
                if (numeros.includes(char)) {
                    state = 7;
                } else if (letras.includes(char)) {
                    state = 6;
                } else if (char === '.') {
                    state = 8;
                } else {
                    return false;
                }
                break;

            case 7:
            case 8:
                if (numeros.includes(char)) {
                    state = 7;
                } else if (letras.includes(char)) {
                    state = 9;
                } else if (char === '.') {
                    state = 8;
                } else {
                    return false;
                }
                break;

            case 9:
                if (numeros.includes(char)) {
                    state = 7;
                } else if (letras.includes(char)) {
                    state = 9;
                } else if (char === '.') {
                    state = 8;
                } else {
                    return false;
                }
                break;

            default:
                return false;
        }
        contador++;
    }
    return state === 9 ? input : false;
}

//automata de telefonos
function ValidarTel(input) {
  
    let state = 0;
    let contador = 0;

    while (contador < input.length) {
        let char = input[contador];

        switch (state) {
            case 0:
                if (numeros.includes(char)) {
                    state = 1;
                }
                else if (char === '+') {
                    state = 2;
                }
                else if (char === '(') {
                    state = 3;
                }
                else {
                    return false;
                }
                break;
            //numero normal
            case 1:
                if (numeros.includes(char)) {
                    state = 4;
                }
                else if (guion.includes(char)) {
                    state = 13;
                }
                else {
                    return false;
                }
                break;
            //numero con codigo de pais
            case 2:
                if (numeros.includes(char)) {
                    state = 28;
                }

                else {
                    return false;
                }
                break;
            //codigo de area entre parentesis
            case 3:
                if (numeros.includes(char)) {
                    state = 22;
                }

                else {
                    return false;
                }
                break;

            //camino normal de numeros
            case 4:
                if (numeros.includes(char)) {
                    state = 5;
                }
                else if (guion.includes(char)) {
                    state = 14;
                }
                else {
                    return false;
                }
                break;
            case 5:
                if (numeros.includes(char)) {
                    state = 6;
                }
                else if (guion.includes(char)) {
                    state = 15;
                }
                else {
                    return false;
                }
                break;
            case 6:
                if (numeros.includes(char)) {
                    state = 7;
                }
                else if (guion.includes(char)) {
                    state = 16;
                }
                else {
                    return false;
                }
                break;

            case 7:
                if (numeros.includes(char)) {
                    state = 8;
                }
                else if (guion.includes(char)) {
                    state = 17;
                }
                else {
                    return false;
                }
                break;
            case 8:
                if (numeros.includes(char)) {
                    state = 9;
                }
                else if (guion.includes(char)) {
                    state = 18;
                }
                else {
                    return false;
                }
                break;
            case 9:
                if (numeros.includes(char)) {
                    state = 10;
                }
                else if (guion.includes(char)) {
                    state = 19;
                }
                else {
                    return false;
                }
                break;
            case 10:
                if (numeros.includes(char)) {
                    state = 11;
                }
                else if (guion.includes(char)) {
                    state = 20;
                }
                else {
                    return false;
                }
                break;
            case 11:
                if (numeros.includes(char)) {
                    state = 12;
                }
                else if (guion.includes(char)) {
                    state = 21;
                }
                else {
                    return false;
                }
                break;
            case 12:
                if (numeros.includes(char)) {
                    state = 30;
                }

                else {
                    return false;
                }
                break;

            //estados extra por si el numero tiene guiones
            case 13:
                if (numeros.includes(char)) {
                    state = 4;
                }

                else {
                    return false;
                }
                break;
            case 14:
                if (numeros.includes(char)) {
                    state = 5;
                }
                else {
                    return false;
                }
                break;
            case 15:
                if (numeros.includes(char)) {
                    state = 6;
                }

                else {
                    return false;
                }
                break;

            case 16:
                if (numeros.includes(char)) {
                    state = 7;
                }

                else {
                    return false;
                }
                break;
            case 17:
                if (numeros.includes(char)) {
                    state = 8;
                }

                else {
                    return false;
                }
                break;
            case 18:
                if (numeros.includes(char)) {
                    state = 9;
                }

                else {
                    return false;
                }
                break;

            case 19:
                if (numeros.includes(char)) {
                    state = 10;
                }

                else {
                    return false;
                }
                break;
            case 20:
                if (numeros.includes(char)) {
                    state = 11;
                }

                else {
                    return false;
                }
                break;
            case 21:
                if (numeros.includes(char)) {
                    state = 12;
                }

                else {
                    return false;
                }
                break;
            //estados por si llevan 3 numeros en parentesis
            case 22:
                if (numeros.includes(char)) {
                    state = 23;
                }
                else if (guion.includes(char)) {
                    state = 26;
                }
                else {
                    return false;
                }
                break;
            case 23:
                if (numeros.includes(char)) {
                    state = 24;
                }
                else if (guion.includes(char)) {
                    state = 27;
                }
                else if (guion.includes(char)) {
                    state = 27;
                }
                else {
                    return false;
                }
                break;
            case 24:
                if (char === ')') {
                    state = 25;
                }

                else {
                    return false;
                }
                break;
            case 25:
                if (numeros.includes(char)) {
                    state = 6;
                }
                else if (guion.includes(char)) {
                    state = 15;
                }
            
                else {
                    return false;
                }
                break;
            case 26:
                if (numeros.includes(char)) {
                    state = 23;
                }
             
                else {
                    return false;
                }
                break;
            case 27:
                if (numeros.includes(char)) {
                    state = 24;
                }
             
                else {
                    return false;
                }
                break;
                //estados por si tiene codigo de pais
            case 28:
                if (numeros.includes(char)) {
                    state = 29;
                }
                else if (guion.includes(char)) {
                    state = 1;
                }
                else if (char === '(') {
                    state = 3;
                }
                else {
                    return false;
                }
                break;
             case 29:
                if (numeros.includes(char)) {
                    state = 1;
                }
                else if (guion.includes(char)) {
                    state = 1;
                }
                else if (guion.includes(char)) {
                    state = 1;
                }
                else if (char === '(') {
                    state = 3;
                }
                else {
                    return false;
                }
                break;
            //estado cuando se tiene un numero de mas de 10 digitos
            case 30:
             
                return false;
                
                break;


            default:
                return false;
        }
        contador++;
    }

    return state === 12 ? input : false;
}

//descargar nuevo archivo txt
function crearArchivoTxt(array, nombreArchivo) {

    const contenido = array.join(",");


    const blob = new Blob([contenido], { type: "text/plain" });

    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = nombreArchivo;

    document.body.appendChild(enlace);
    enlace.click();


    document.body.removeChild(enlace);
}
