const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')

class VacRoutes extends BaseRoute {
    constructor(userDb, vacDb) {
        super()
        this.userDb = userDb
        this.vacDb = vacDb
    }

    list() {
        return {
            path: '/vac/{cpf}',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'listar vacinas',
                notes: 'retorna as vacinas de um usuário',
                validate: {
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params: {
                        cpf: Joi.string().required()
                    },
                }
            },
            handler: async (request, headers) => {
                var _cpf = request.params.cpf
                var user = await this.userDb.readUser({cpf:_cpf})

                if(user.length == 0){
                    return {
                        response: false,
                        message: 'Usuário não encontrado!'
                    }
                } 

                return this.vacDb.readVac({cpf:_cpf})
            }
        }
    }
    create() {
        return {
            path: '/vac',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'cadastrar vacinas',
                notes: 'Cadastra uma vacina vinculada a um usuário',
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    payload: {
                        cpf: Joi.string().required(),
                        id: Joi.string().required(),
                        description: Joi.string().required(),
                        shots: Joi.number().required(),
                        image: Joi.string()
                    }
                },

            },
            handler: async (request, headers) => {
                const payload = request.payload
                const _cpf = payload.cpf
                const _id = payload.id;
                const user = await this.userDb.readUser({cpf: _cpf})

                if(user.length == 0){
                    return {
                        response: false,
                        message: 'Usuário não encontrado!'
                    }
                } 

                const vacines = await this.vacDb.readVac({cpf: _cpf, id: _id})

                if(vacines.length > 0){
                    return {
                        response: false,
                        message: 'Vacina já adicionada!'
                    }
                }
                return this.vacDb.create(payload)
            }
        }
    }
    update() {
        return {
            path: '/vac/{cpf}/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'atualizar vacina',
                notes: 'atualiza uma vacina de um usuario',
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params: {
                        cpf: Joi.string().required(),
                        id: Joi.string().required()
                    },
                    payload: {
                        description: Joi.string(),
                        shots: Joi.number(),
                        image: Joi.string()
                    }
                },

            },
            handler: async (request, headers) => {
                const payload = request.payload;
                const _cpf = request.params.cpf;
                const id = request.params.id;
                var user = await this.userDb.readUser({cpf: _cpf})

                if(user.length == 0){
                    return {
                        response: false,
                        message: 'Usuário não encontrado!'
                    }
                }
                
                return this.vacDb.updateVac(id, _cpf, payload)
            }
        }
    }
    delete() {
        return {
            path: '/vac/{cpf}/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'remover vacinas',
                notes: 'remove uma vacina por cpf e id',
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params: {
                        cpf: Joi.string().required(),
                        id: Joi.string().required()
                    }
                }
            },
            handler: (request, headers) => {
                const cpf = request.params.cpf;
                const id = request.params.id;
                return this.vacDb.deleteVac(id, cpf)
            }
        }
    }

}

module.exports = VacRoutes