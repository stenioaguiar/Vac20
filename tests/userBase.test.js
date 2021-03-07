const assert = require('assert')
const MongoDb = require('../src/db/strategies/mongodb/mongoDbStrategy')
const UserSchema = require('../src/db/strategies/mongodb/schemas/userSchema')
const Context = require('../src/db/strategies/base/contextStrategy')

// 1o alterar criar pasta mongodb
// 2o mover mongodbStrategy para mongodb
// 3o modificar classe do mongodbStrategy
// 4o modificar criar schema em mongodb/schemas
// 6o modificar teste fazendo conexão direto do MongoDB
// 5o modificar teste passando para o MongoDB

const MOCK_USER_CADASTRAR = {
    cpf: '37511387810',
    password: '123',
    firstName: 'user',
    lastName: 'cadastrar',
    dob: new Date(1980,11,17)
};

const MOCK_USER_ATUALIZAR = {
    cpf: '74577542487',
    password: 'pass123',
    firstName: 'user',
    lastName: 'atualizar',
    dob: new Date(1990,11,17)
};

let context = {}

describe('UserBase Suite de testes', function () {
    this.beforeAll(async () => {
        const connection = MongoDb.connect()
        context = new Context(new MongoDb(connection, UserSchema))

        await context.create(MOCK_USER_ATUALIZAR)
    })
    it('verificar conexao', async () => {
        const result = await context.isConnected()
        const expected = 'Conectado'

        assert.deepEqual(result, expected)
    })
    it('cadastrar', async () => {
        const { cpf, password, firstName, lastName, dob} = await context.create(MOCK_USER_CADASTRAR)
        
        assert.deepEqual({ cpf, firstName, lastName, dob, password }, MOCK_USER_CADASTRAR)
    })

    it('listar', async () => {
        const [{ cpf, password, firstName, lastName, dob}] = await context.readUser({ cpf: MOCK_USER_CADASTRAR.cpf})
        const result = {
            cpf, password, firstName, lastName, dob
        }
        assert.deepEqual(result, MOCK_USER_CADASTRAR)
    })
    it('atualizar', async () => {
        const result = await context.updateUser(MOCK_USER_ATUALIZAR.cpf, {
            firstName: 'novo nome'
        })
        assert.deepEqual(result.nModified, 1)
    })
    it('remover', async () => {
        const result = await context.deleteUser(MOCK_USER_ATUALIZAR.cpf)
        await context.deleteUser(MOCK_USER_CADASTRAR.cpf)
        assert.deepEqual(result.n, 1)
    })
})