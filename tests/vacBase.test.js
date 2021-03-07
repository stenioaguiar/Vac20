const assert = require('assert')
const MongoDb = require('../src/db/strategies/mongodb/mongoDbStrategy')
const VacSchema = require('../src/db/strategies/mongodb/schemas/vacSchema')
const Context = require('../src/db/strategies/base/contextStrategy')

// 1o alterar criar pasta mongodb
// 2o mover mongodbStrategy para mongodb
// 3o modificar classe do mongodbStrategy
// 4o modificar criar schema em mongodb/schemas
// 6o modificar teste fazendo conexão direto do MongoDB
// 5o modificar teste passando para o MongoDB

const MOCK_VAC_CADASTRAR = {
    id: 'TPC3',
    cpf: '14587896510',
    description: 'TRIPLICE',
    shots: 1,
    image: 'image'
};

const MOCK_VAC_ATUALIZAR = {
    id: 'TPC3',
    cpf: '14587896511',
    description: 'FEBRE AMARELA',
    shots: 2,
    image: 'image'
};

let context = {}

describe('VacBase Suite de testes', function () {
    this.beforeAll(async () => {
        const connection = MongoDb.connect()
        context = new Context(new MongoDb(connection, VacSchema))

        await context.create(MOCK_VAC_ATUALIZAR)
    })
    it('verificar conexao', async () => {
        const result = await context.isConnected()
        const expected = 'Conectado'

        assert.deepEqual(result, expected)
    })
    it('cadastrar', async () => {
        const { id, cpf, description, shots, image } = await context.create(MOCK_VAC_CADASTRAR)
        
        assert.deepEqual({ id, cpf, description, shots, image }, MOCK_VAC_CADASTRAR)
    })

    it('listar', async () => {
        const result = await context.readVac({ id: MOCK_VAC_CADASTRAR.id, cpf: MOCK_VAC_CADASTRAR.cpf})
        

        console.log(result)
        assert.deepEqual(1, 1)
    })
    it('atualizar', async () => {
        const result = await context.updateVac(MOCK_VAC_ATUALIZAR.id, MOCK_VAC_ATUALIZAR.cpf, {
            description: 'yellow fever'
        })
        assert.deepEqual(result.nModified, 1)
    })
    it('remover', async () => {
        const result = await context.deleteVac(MOCK_VAC_ATUALIZAR.id, MOCK_VAC_ATUALIZAR.cpf)
        await context.deleteVac(MOCK_VAC_CADASTRAR.id)
        assert.deepEqual(result.n, 1)
    })
})