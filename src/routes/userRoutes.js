const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Validator = require('../../src/utils/validator')

class UserRoutes extends BaseRoute {
    constructor(userDb, businessDb, visitDb) {
        super()
        this.userDb = userDb
        this.businessDb = businessDb
        this.visitDb = visitDb
        this.validator = new Validator()
    }

    list() {
        return {
            path: '/users',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'listar users',
                notes: 'retorna a base inteira de users',
                validate: {
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown()
                }
            },
            handler: (request, headers) => {
                return this.userDb.readUser()
            }
        }
    }
    create() {
        return {
            path: '/users',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'cadastrar users',
                notes: 'Cadastra um user por cpf, nome e password',
                validate: {
                    payload: {
                        cpf: Joi.string().max(100).required(),
                        firstName: Joi.string().max(30).required(),
                        lastName: Joi.string().max(30).required(),
                        password: Joi.string().max(30).required()
                    }
                },

            },
            handler: async (request, headers) => {
                const payload = request.payload

                if(!this.validator.validateCpf(payload.cpf)){
                    return {
                        response: false,
                        message: "CPF inválido"
                    }
                }

                const user = await this.userDb.create(payload)

                if (user != null) {
                    return {
                        response: true,
                        message: user
                    }
                }

                return {
                    response: false,
                    message: "Erro ao adicionar user"
                }
            }
        }
    }
    update() {
        return {
            path: '/users/{cpf}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'atualizar users',
                notes: 'atualiza um user por cpf',
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params: {
                        cpf: Joi.string().required()
                    },
                    payload: {
                        firstName: Joi.string().max(30),
                        lastName: Joi.string().max(30),
                        password: Joi.string().max(30),
                        image: Joi.string().max(30)
                    }
                },

            },
            handler: async (request, headers) => {
                const payload = request.payload;
                const cpf = request.params.cpf;

                const update = await this.userDb.updateUser(cpf, payload)
                
                if (update.nModified > 0){
                    return {
                        response: true,
                        message: "User Atualizado"
                    }
                }

                return {
                    response: true,
                    message: "Erro ao atualizar"
                }
            }
        }
    }
    delete() {
        return {
            path: '/users/{cpf}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'remover users',
                notes: 'remove um user por cpf',
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params: {
                        cpf: Joi.string().required()
                    }
                }
            },
            handler: (request, headers) => {
                const cpf = request.params.cpf;
                return this.userDb.deleteUser(cpf)
            }
        }
    }
    notify() {
        return {
            path: '/users/notify/{cpf}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'notificar contaminação',
                notes: 'atualiza usuario para contaminado',
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params: {
                        cpf: Joi.string().required()
                    }
                },

            },
            handler: async (request, headers) => {
                const cpf = request.params.cpf;
                const payload = {contaminated: true, contaminationDate: new Date()}
                const update = await this.userDb.updateUser(cpf, payload)
                
                if (update.nModified > 0){
                    return {
                        response: true,
                        message: "User Atualizado"
                    }
                }

                return {
                    response: true,
                    message: "Erro ao atualizar"
                }
            }
        }
    }
    cure() {
        return {
            path: '/users/recovery/{cpf}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'notificar recuperação',
                notes: 'atualiza usuario para não contaminado',
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params: {
                        cpf: Joi.string().required()
                    }
                },

            },
            handler: async (request, headers) => {
                const cpf = request.params.cpf;
                const payload = {contaminated: false}
                const update = await this.userDb.updateUser(cpf, payload)
                
                if (update.nModified > 0){
                    return {
                        response: true,
                        message: "User Atualizado"
                    }
                }

                return {
                    response: true,
                    message: "Erro ao atualizar"
                }
            }
        }
    }
    visits() {
        return {
            path: '/users/visits/{cpf}',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'visualizar locais visitados',
                notes: 'exibe locais visitados pelo usuário',
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params: {
                        cpf: Joi.string().required()
                    }
                },

            },
            handler: async (request, headers) => {
                const _cpf = request.params.cpf;

                const visits = await this.visitDb.readVisit({cpf: _cpf})

                if(visits.length == 0) {
                    return {
                        response: false,
                        message: "Não existem visitas cadastradas"
                    }
                }
                
                let places = []
                for (const element of visits) {
                    const business = await this.businessDb.readBusiness({cnpj: element.cnpj})
                    places.push({
                        place: business[0].name,
                        date: element.insertedAt
                    })
                  }
                  return {
                      response: true,
                      message: places
                  }
            }
        }
    }
}

module.exports = UserRoutes