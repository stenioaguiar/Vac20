const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')

class UserRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
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
                return this.db.readUser()
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
            handler: (request, headers) => {
                const payload = request.payload
                return this.db.create(payload)
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

                const update = await this.db.updateUser(cpf, payload)
                
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
                return this.db.deleteUser(cpf)
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
                const payload = {contaminated: true}
                const update = await this.db.updateUser(cpf, payload)
                
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
                const update = await this.db.updateUser(cpf, payload)
                
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
}

module.exports = UserRoutes