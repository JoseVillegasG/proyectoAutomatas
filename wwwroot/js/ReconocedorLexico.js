function lexer(input) {
    const tokens = [];
    const chars = input.trim().split(/\s*/);
    let i = 0;

    const isLetter = c => /[a-zA-Z]/.test(c);
    const isDigit = c => /\d/.test(c);

    while (i < chars.length) {
        const c = chars[i];

        // Identificador: letra seguida de letras o dígitos
        if (isLetter(c)) {
            let id = c;
            i++;
            while (i < chars.length && (isLetter(chars[i]) || isDigit(chars[i]))) {
                id += chars[i++];
            }
            tokens.push("id");
        }
        // Número: opcional signo seguido de dígitos
        else if (c === "+" || c === "-") {
            if (i + 1 < chars.length && isDigit(chars[i + 1])) {
                let num = c;
                i++;
                while (i < chars.length && isDigit(chars[i])) {
                    num += chars[i++];
                }
                tokens.push("num");
            } else {
                tokens.push(c);
                i++;
            }
        }
        else if (isDigit(c)) {
            let num = c;
            i++;
            while (i < chars.length && isDigit(chars[i])) {
                num += chars[i++];
            }
            tokens.push("num");
        }
        // Operadores y paréntesis
        else if ("+-*/=()".includes(c)) {
            tokens.push(c);
            i++;
        }
        // Espacios u otros
        else {
            throw new Error(`Carácter no válido: '${c}'`);
        }
    }

    return tokens;
}

function parse(tokens) {
    let i = 0;

    function expect(token) {
        if (tokens[i] === token) {
            i++;
            return true;
        }
        return false;
    }

    function F() {
        if (tokens[i] === "id" || tokens[i] === "num") {
            i++;
            return true;
        } else if (expect("(")) {
            if (!E()) return false;
            return expect(")");
        }
        return false;
    }

    function T() {
        if (!F()) return false;
        while (tokens[i] === "*" || tokens[i] === "/") {
            i++;
            if (!F()) return false;
        }
        return true;
    }

    function E() {
        if (!T()) return false;
        while (tokens[i] === "+" || tokens[i] === "-") {
            i++;
            if (!T()) return false;
        }
        return true;
    }

    function S() {
        if (tokens[i] !== "id") return false;
        i++;
        if (!expect("=")) return false;
        return E();
    }

    const valid = S();
    return valid && i === tokens.length;
}



function Leer() {
    var input = $('#cadenaInput').val();
    try {
        const tokens = lexer(input);
        console.log("Tokens:", tokens);
        const valid = parse(tokens);
        console.log("Es expresión válida?", valid);
    } catch (e) {
        console.error("Error:", e.message);
    }
}