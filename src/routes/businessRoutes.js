const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Jwt = require('jsonwebtoken')
const Validator = require('../../src/utils/validator')
const Boom = require('boom')

const USER = {
    username: '1',
    password: '1'
}

class UserRoutes extends BaseRoute {
    constructor(key, businessDb, userDb, visitDb) {
        super()
        this.secret = key
        this.businessDb = businessDb
        this.userDb = userDb
        this.visitDb = visitDb
        this.validator = new Validator()
    }

    list() {
        return {
            path: '/business',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'listar business',
                notes: 'retorna a base inteira de users',
                validate: {
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown()
                }
            },
            handler: (request, headers) => {
                return this.businessDb.readBusiness()
            }
        }
    }
    create() {
        return {
            path: '/business',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'cadastrar business',
                notes: 'Cadastra um business por cnpj, endereço e password',
                validate: {
                    failAction:
                        async (request, h, err) => {
                            const error = Boom.badRequest('Payload Incorreto')
                            error.output.statusCode = 200   // Assign a custom error code
                            error.reformat()
                            error.output.payload.response = false 
                            throw error;
                        },
                    payload: {
                        cnpj: Joi.string().required(),
                        password: Joi.string().required(),
                        name: Joi.string().required(),
                        description: Joi.string(),
                        addressStreet: Joi.string().required(),
                        addressNumber: Joi.number().required(),
                        addressComplement: Joi.string(),
                        addressCity: Joi.string().required(),
                        addressState: Joi.string().required(),
                        addressCountry: Joi.string().required(),
                        addressCode: Joi.string().required(),
                        addressLatitude: Joi.string(),
                        addressLongitude: Joi.string()
                    }
                },
            },
            handler: async (request, headers) => {
                const payload = request.payload
                
                if(!await this.validator.validateCnpj(payload.cnpj)){
                    return {
                        response: false,
                        message: "CNPJ inválido"
                    }
                }

                const business = await this.businessDb.create(payload)

                if (business != null) {
                    return {
                        response: true,
                        message: business
                    }
                }

                return {
                    response: false,
                    message: "Erro ao adicionar business"
                }
            }
        }
    }
    update() {
        return {
            path: '/business/{cnpj}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'atualizar business',
                notes: 'atualiza um business por cnpj',
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params: {
                        cnpj: Joi.string().required()
                    },
                    payload: {
                        password: Joi.string(),
                        name: Joi.string(),
                        description: Joi.string(),
                        addressStreet: Joi.string(),
                        addressNumber: Joi.number(),
                        addressComplement: Joi.string(),
                        addressCity: Joi.string(),
                        addressState: Joi.string(),
                        addressCountry: Joi.string(),
                        addressCode: Joi.string(),
                        addressLatitude: Joi.string().required(),
                        addressLongitude: Joi.string().required()
                    }
                },
            },
            handler: async (request, headers) => {
                const payload = request.payload;
                const cnpj = request.params.cnpj;

                const update = await this.businessDb.updateBusiness(cnpj, payload)
                
                if (update.nModified > 0){
                    return {
                        response: true,
                        message: "Business Atualizado"
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
            path: '/business/{cnpj}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'remover business',
                notes: 'remove um business por cnpj',
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params: {
                        cnpj: Joi.string().required()
                    }
                }
            },
            handler: (request, headers) => {
                const cnpj = request.params.cnpj;
                return this.businessDb.deleteBusiness(cnpj)
            }
        }
    }
    login() {
        return {
            path: '/business/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'fazer login de empresa',
                notes: 'retorna o token',
                validate: {
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request, headers) => {
                const {
                    username,
                    password
                } = request.payload
                
                const business = await this.businessDb.readBusiness({cnpj: request.payload.username});
                
                if(business.length == 0){
                    return {
                        response: false,
                        message: 'Usuário ou senha incorreto!'
                    }
                } 

                if (
                    username.toLowerCase() !== business[0].cnpj ||
                    password !== business[0].password
                )
                    return Boom.unauthorized()
                return {
                    token: Jwt.sign({
                        username: username
                    }, this.secret, {
                        expiresIn: 300})
                }
            }
        }
    }
    logout() {
        return {
            path: '/business/logout',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'fazer logout',
                notes: 'retorna o token',
                validate: {
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown()
                }
            },
            handler: async (request, headers) => {
                return {
                    mensagem: "usuário desconectado"
                }
            }
        }
    }
    validate() {
        return {
            path: '/business/validate/{cpf}',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'validar usuário',
                notes: 'retorna status do usuário',
                validate: {
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params: {
                        cpf: Joi.string().required()
                    }
                }
            },
            handler: async (request, headers) => {
                const _cpf = request.params.cpf

                var user = await this.userDb.readUser({cpf: _cpf})

                if(user.length == 0){
                    return {
                        response: false,
                        message: 'Usuário não encontrado!'
                    }
                }
                
                if(user[0].vacStatus && !user[0].contaminated){
                    return {
                        response: true,
                        message: "Usuário protegido"
                    }
                }

                if(user[0].contaminated){
                    return {
                        response: false,
                        message: "Usuário contaminado"
                    }
                }

                return {
                    response: false,
                    message: "Usuário não protegido"
                }
            }
        }
    }
    visit() {
        return {
            path: '/business/visit',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'registrar visita',
                notes: 'registra visita de um usuário',
                validate: {
                    payload: {
                        cnpj: Joi.string().required(),
                        cpf: Joi.string().required(),
                    }
                },
            },
            handler: async (request, headers) => {
                const payload = request.payload

                var user = await this.userDb.readUser({cpf: payload.cpf})

                if(user.length == 0){
                    return {
                        response: false,
                        message: 'Usuário não encontrado!'
                    }
                }

                var business = await this.businessDb.readBusiness({cnpj: payload.cnpj})

                if(business.length == 0){
                    return {
                        response: false,
                        message: 'Business não encontrado!'
                    }
                }

                const visit = await this.visitDb.create(payload)

                if(visit != null) {
                    return {
                        reponse : true,
                        message: "Visita Registrada"
                    }    
                }
                return this.visitDb.create(payload)
            }
        }
    }
    visitors() {
        return {
            path: '/business/visitors/{cnpj}',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'listar visitantes',
                notes: 'retorna visitantes do estabelecimento',
                validate: {
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params: {
                        cnpj: Joi.string().required()
                    }
                }
            },
            handler: async (request, headers) => {
                const _cnpj = request.params.cnpj
                var business = await this.businessDb.readBusiness({cnpj: _cnpj})

                if(business.length == 0){
                    return {
                        response: false,
                        message: 'Business não encontrado!'
                    }
                }

                const visit = await this.visitDb.readVisit({cnpj: _cnpj})

                if(visit.length == 0) {
                    return {
                        response: false,
                        message: "Não existem visitas cadastradas"
                    }
                }

                let contaminatedVisitors = 0

                for (const element of visit) {
                    const visitor = await this.userDb.readUser({cpf: element.cpf})
                    let _contaminated = false
                    const diffDays = parseInt((element.insertedAt - visitor[0].contaminationDate) / (1000 * 60 * 60 * 24))

                    if(Math.abs(diffDays) <=15){
                        _contaminated = true
                    }

                    if(visitor[0].contaminated && _contaminated){
                        contaminatedVisitors = contaminatedVisitors + 1
                    }
                  }
                  
                return {
                    response: true,
                    message: {
                        visitors: visit.length,
                        contaminated: contaminatedVisitors
                    }
                }
            }
        }
    }
}

module.exports = UserRoutes