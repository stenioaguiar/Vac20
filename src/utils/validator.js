const {cpf, cnpj}  = require('cpf-cnpj-validator')

class Validator {
    constructor() {}

    validateCpf(_cpf) {

        return cpf.isValid(_cpf)
    }

    validateCnpj(_cnpj) {

        return cnpj.isValid(_cnpj)
    }
}

module.exports = Validator