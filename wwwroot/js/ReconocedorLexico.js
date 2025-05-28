function lexer(input) {
    const tokens = [];
    const chars = input.trim();
    let i = 0;

    const isLetter = (c) => /[a-zA-Z]/.test(c);
    const isDigit = (c) => /[0-9]/.test(c);
    const isWhitespace = (c) => /\s/.test(c);

    while (i < chars.length) {
        const c = chars[i];

        // Saltar espacios
        if (isWhitespace(c)) {
            i++;
            continue;
        }

        // Identificadores: letras seguidas de letras o dígitos
        if (isLetter(c)) {
            let id = c;
            i++;
            while (i < chars.length && (isLetter(chars[i]) || isDigit(chars[i]))) {
                id += chars[i++];
            }
            tokens.push("id");
            continue;
        }

        // Números con signo opcional (+ o -)
        if ((c === '+' || c === '-') && i + 1 < chars.length && isDigit(chars[i + 1])) {
            let num = c + chars[i + 1];
            i += 2;
            while (i < chars.length && isDigit(chars[i])) {
                num += chars[i++];
            }
            tokens.push("num");
            continue;
        }

        // Números sin signo
        if (isDigit(c)) {
            let num = c;
            i++;
            while (i < chars.length && isDigit(chars[i])) {
                num += chars[i++];
            }
            tokens.push("num");
            continue;
        }

        // Operadores y paréntesis: + - * / = ( )
        if ("+-*/=()".includes(c)) {
            tokens.push(c);
            i++;
            continue;
        }

        // Caracter no reconocido
        throw new Error(`Carácter no reconocido: '${c}' en la posición ${i}`);
    }

    return tokens;
}

//function parse(tokens) {
//    let i = 0;

//    function expect(token) {
//        if (tokens[i] === token) {
//            i++;
//            return true;
//        }
//        return false;
//    }

//    function F() {
//        if (tokens[i] === "id" || tokens[i] === "num") {
//            i++;
//            return true;
//        } else if (expect("(")) {
//            if (!E()) return false;
//            return expect(")");
//        }
//        return false;
//    }

//    function T() {
//        if (!F()) return false;
//        while (tokens[i] === "*" || tokens[i] === "/") {
//            i++;
//            if (!F()) return false;
//        }
//        return true;
//    }

//    function E() {
//        if (!T()) return false;
//        while (tokens[i] === "+" || tokens[i] === "-") {
//            i++;
//            if (!T()) return false;
//        }
//        return true;
//    }

//    function S() {
//        if (tokens[i] !== "id") return false;
//        i++;
//        if (!expect("=")) return false;
//        return E();
//    }

//    const valid = S();
//    return valid && i === tokens.length;
//}

function parseWithDerivation(tokens) {
    let i = 0;
    const derivationSteps = [];

    function current() {
        return tokens[i];
    }

    function advance() {
        return tokens[i++];
    }

    function expect(token) {
        if (current() === token) {
            advance();
            return true;
        }
        return false;
    }

    function log(rule) {
        derivationSteps.push(rule);
    }

    function F() {
        if (current() === "id") {
            log("F → id");
            advance();
            return true;
        }
        if (current() === "num") {
            log("F → num");
            advance();
            return true;
        }
        if (expect("(")) {
            log("F → ( E )");
            if (!E()) return false;
            if (!expect(")")) return false;
            return true;
        }
        return false;
    }

    function T() {
        if (!F()) return false;
        while (current() === "*" || current() === "/") {
            const op = advance();
            if (!F()) return false;
            log(`T → T ${op} F`);
        }
        log("T → F");
        return true;
    }

    function E() {
        if (!T()) return false;
        while (current() === "+" || current() === "-") {
            const op = advance();
            if (!T()) return false;
            log(`E → E ${op} T`);
        }
        log("E → T");
        return true;
    }

    function S() {
        if (!expect("id")) return false;
        if (!expect("=")) return false;
        log("S → id = E");
        return E();
    }

    const valid = S();
    if (valid && i === tokens.length) {
        return { valid: true, derivation: derivationSteps };
    } else {
        return { valid: false, derivation: [] };
    }
}

function identificar() {
    var input = $('#cadenaInput').val();
    var identBox = document.getElementById('tokensText');
    try {
        const tokens = lexer(input);
        identBox.value = tokens.join(" ");
    } catch (e) {
        console.error("Error:", e.message);
        identBox.value = "Error: " + e.message;
    }
}


function leerTodos() {
    var input = documet.getElementById('cadenaInput');

}


function Leer() {
    var input = $('#cadenaInput').val();
    var validarBox = document.getElementById('validarText')
    var validarlabel = document.getElementById('verdadero')
    try {
        const tokens = lexer(input);
        console.log("Tokens:", tokens);
        const valid = parseWithDerivation(tokens);
        console.log("Es expresión válida?", valid);
        validarBox.value = valid.derivation.join("");
        if (valid.valid) {
            validarlabel.innerHTML = "Cadena Valida"
        } else {
            validarlabel.innerHTML = "Cadena no valida"
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

