"""Validadores de CPF e e-mail.

Lógica de negócio pura, sem dependência de framework web.
Pensada para ser exercitada via TDD na disciplina PC010027 (UFOPA).
"""

import re

_REGEX_EMAIL = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")


def _calcular_digito_verificador(digitos: str, peso_inicial: int) -> int:
    pesos = range(peso_inicial, 1, -1)
    soma = sum(int(d) * peso for d, peso in zip(digitos, pesos, strict=True))
    resto = (soma * 10) % 11
    return 0 if resto == 10 else resto


def validar_cpf(cpf: str | None) -> bool:
    if not isinstance(cpf, str):
        return False

    apenas_digitos = re.sub(r"[.\-\s]", "", cpf)

    if len(apenas_digitos) != 11 or not apenas_digitos.isdigit():
        return False

    if len(set(apenas_digitos)) == 1:
        return False

    primeiro = _calcular_digito_verificador(apenas_digitos[:9], peso_inicial=10)
    segundo = _calcular_digito_verificador(apenas_digitos[:10], peso_inicial=11)

    return apenas_digitos[9] == str(primeiro) and apenas_digitos[10] == str(segundo)


def validar_email(email: str | None) -> bool:
    if not isinstance(email, str) or not email:
        return False
    return _REGEX_EMAIL.match(email) is not None

def calcular_dv_cnpj(digitos: str, peso_inicial: int) -> int:
    soma = 0

    for i in range(len(digitos)):
        soma += int(digitos[i]) * peso_inicial
        peso_inicial -= 1
        if peso_inicial < 2:
            peso_inicial = 9

    resto = (soma * 10) % 11
    return 0 if resto == 10 else resto


def validar_cnpj(cnpj: str | None) -> bool:
    if not isinstance(cnpj, str):
        return False

    apenas_digitos = re.sub(r"[./\-\s]", "", cnpj)

    if len(apenas_digitos) != 14 or not apenas_digitos.isdigit():
        return False

    if re.match(r"^(\d)\1{13}$", apenas_digitos):
        return False
    primeiro = calcular_dv_cnpj(apenas_digitos[:12], 5)
    segundo = calcular_dv_cnpj(apenas_digitos[:13], 6)

    return int(apenas_digitos[12]) == primeiro and int(apenas_digitos[13]) == segundo
