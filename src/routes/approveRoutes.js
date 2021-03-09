const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')

class ApproveRoutes extends BaseRoute {
    constructor(userDb, vacDb, approveDb) {
        super()
        this.userDb = userDb
        this.vacDb = vacDb
        this.approveDb = approveDb
    }

    list() {
        return {
            path: '/vacApprove',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'listar vacinas',
                notes: 'retorna as vacinas a serem aprovadas',
                validate: {
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown()
                }
            },
            handler: async (request, headers) => {

                return {
                    response: true,
                    message: await this.approveDb.readVac({repproved: false})
                }
            }
        }
    }
    approve() {
        return {
            path: '/vacApprove/accept',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'aprovar vacinas',
                notes: 'Aprova uma vacina cadastrada',
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    payload: {
                        cpf: Joi.string().required(),
                        id: Joi.string().required()
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

                const vac = await this.approveDb.readVac({cpf: _cpf, id: _id, repproved: false})

                if(vac.length == 0){
                    return {
                        response: false,
                        message: 'Vacina não encontrada!'
                    }
                }

                const vacAdd = {
                    id: _id,
                    cpf: _cpf,
                    description: vac[0].description,
                    shots: vac[0].shots,
                    image: vac[0].image
                }

                const approved = await this.vacDb.create(vacAdd)
                if (approved != null) {
                    await this.approveDb.approveVac(_id, _cpf)
                    return {
                        response: true,
                        message: "vacina aprovada"
                    }
                }

                return {
                    response: false,
                    message: "erro ao aprovar vacina"
                }
            }
        }
    }
    disapprove() {
        return {
            path: '/vacApprove/deny',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'reprovar vacinas',
                notes: 'Reprova uma vacina ',
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    payload: {
                        cpf: Joi.string().required(),
                        id: Joi.string().required()
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

                const vacine = await this.approveDb.readVac({cpf: _cpf, id: _id})

                if(vacine.length == 0){
                    return {
                        response: false,
                        message: 'Vacina não encontrada!'
                    }
                }

                const disapproveBody = {
                    repproved: true
                }
                const disapprove = await this.approveDb.disapproveVac(_id, _cpf, disapproveBody)

                if (disapprove != null){
                    return {
                        response: true,
                        message: "vacina reprovada"
                    }
                }

                return {
                    response: false,
                    message: "erro ao reprovar vacina"
                }
            }
        }
    }
}

module.exports = ApproveRoutes