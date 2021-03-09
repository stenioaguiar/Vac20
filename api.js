const Hapi = require('hapi')
const Context = require('./src/db/strategies/base/contextStrategy')
const AuthRoutes = require('./src/routes/authRoutes')
const UserRoutes = require('./src/routes/userRoutes')
const VacRoutes = require('./src/routes/vacRoutes')
const ApproveRoutes = require('./src/routes/approveRoutes')
const BusinessRoutes = require('./src/routes/businessRoutes')
const MongoDB = require('./src/db/strategies/mongodb/mongoDbStrategy')
const UserSchema = require('./src/db/strategies/mongodb/schemas/userSchema')
const VacSchema = require('./src/db/strategies/mongodb/schemas/vacSchema')
const ApproveSchema = require('./src/db/strategies/mongodb/schemas/approveSchema')
const BusinessSchema = require('./src/db/strategies/mongodb/schemas/businessSchema')
const VisitSchema = require('./src/db/strategies/mongodb/schemas/visitSchema')

const HapiSwagger = require('hapi-swagger')
const Inert = require('inert')
const Vision = require('vision')
const Jwt = require('jsonwebtoken')
const HapiJwt = require('hapi-auth-jwt2')
const JWT_KEY = '1FDD50B19896CFBF2E5ACC30487E09E2'

const swaggerConfig = {
    info: {
        title: '#Vac20 - Vacinas',
        version: 'v1.0'
    },
    lang: 'pt'
}

const app = new Hapi.Server({
    port: process.env.PORT || 5000,
    routes: {
        cors: true
    }
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDB.connect()
    const userMongoDb = new Context(new MongoDB(connection, UserSchema))
    const vacMongoDb = new Context(new MongoDB(connection, VacSchema))
    const approveMongoDb = new Context(new MongoDB(connection, ApproveSchema))
    const businessMongoDb = new Context(new MongoDB(connection, BusinessSchema))
    const visitMongoDb = new Context(new MongoDB(connection, VisitSchema))

    await app.register([
        HapiJwt,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerConfig
        }
    ])
    
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_KEY,
        options: {
            expiresIn: 5
        },
        validate: (dado, request) => {
            return {
                isValid: true
            }
        }
    })

    app.auth.default('jwt')

    app.route([
        ...mapRoutes(new UserRoutes(userMongoDb, businessMongoDb, visitMongoDb), UserRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_KEY, userMongoDb), AuthRoutes.methods()),
        ...mapRoutes(new VacRoutes(userMongoDb, vacMongoDb, approveMongoDb), VacRoutes.methods()),
        ...mapRoutes(new ApproveRoutes(userMongoDb, vacMongoDb, approveMongoDb), ApproveRoutes.methods()),
        ...mapRoutes(new BusinessRoutes(JWT_KEY, businessMongoDb, userMongoDb, visitMongoDb), BusinessRoutes.methods())
    ])

    await app.start()
    console.log('server running at', app.info.port)
    return app;
}

module.exports = main()