const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')

const USER = {
    username: '1',
    password: '1'
}
const Jwt = require('jsonwebtoken')

class AuthRoutes extends BaseRoute {
    constructor(key, userDb) {
        super()
        this.secret = key
        this.UserDb = userDb
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'fazer login',
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
                
                const user = await this.UserDb.readUser({cpf: request.payload.username});
                
                if(user.length == 0){
                    return {
                        response: false,
                        message: 'Usuário ou senha incorreto!'
                    }
                } 

                if (
                    username.toLowerCase() !== user[0].cpf ||
                    password !== user[0].password
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
            path: '/logout',
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
}
module.exports = AuthRoutes