// Porte JavaScript dos validadores em src/validators.py.
// A versão principal é o Python — este arquivo existe apenas para
// permitir um demo interativo no GitHub Pages (que só hospeda
// conteúdo estático). Qualquer mudança de regra deve ser feita
// primeiro no Python (com testes), e depois replicada aqui.

const REGEX_EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function calcularDigitoVerificador(digitos, pesoInicial) {
    let soma = 0;
    for (let i = 0; i < digitos.length; i++) {
        soma += parseInt(digitos[i], 10) * (pesoInicial - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
}

export function validarCpf(cpf) {
    if (typeof cpf !== "string") return false;

    const apenasDigitos = cpf.replace(/[.\-\s]/g, "");

    if (apenasDigitos.length !== 11 || !/^\d{11}$/.test(apenasDigitos)) return false;
    if (new Set(apenasDigitos).size === 1) return false;

    const primeiro = calcularDigitoVerificador(apenasDigitos.slice(0, 9), 10);
    const segundo = calcularDigitoVerificador(apenasDigitos.slice(0, 10), 11);

    return apenasDigitos[9] === String(primeiro) && apenasDigitos[10] === String(segundo);
}

export function validarEmail(email) {
    if (typeof email !== "string" || email.length === 0) return false;
    return REGEX_EMAIL.test(email);
}

function calcularDvCnpj(digitos, pesoInicial) {
    let soma = 0;
    
    for (let i = 0; i < digitos.length; i++) {
        soma += parseInt(digitos[i], 10) * pesoInicial;
        pesoInicial--;
        if (pesoInicial < 2) pesoInicial = 9;
    }
    
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
}

export function validarCnpj(cnpj) {
    if (typeof cnpj !== "string") return false;

    const apenasDigitos = cnpj.replace(/[.\-\/\s]/g, "");

    if (apenasDigitos.length !== 14 || !/^\d{14}$/.test(apenasDigitos)) return false;
    
    // Verifica se não são todos dígitos iguais
    if (/^(\d)\1{13}$/.test(apenasDigitos)) return false;

    const primeiro = calcularDvCnpj(apenasDigitos.slice(0, 12), 5);
    const segundo = calcularDvCnpj(apenasDigitos.slice(0, 13), 6);

    return parseInt(apenasDigitos[12]) === primeiro && parseInt(apenasDigitos[13]) === segundo;
}