const ICrud = require('../base/interfaceDb')
const Mongoose = require('mongoose')
const STATUS = {
    0: 'Disconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Disconectando',
}
class MongoDB extends ICrud {
    // 3o
    constructor(connection, schema) {
        super()
        // 4o
        this._connection = connection;
        this._collection = schema;
    }
    // 2o
    async isConnected() {
        const state = STATUS[this._connection.readyState]
        if (state === 'Conectado') return state;

        if (state !== 'Conectando') return state

        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._connection.readyState]

    }
     // 1o 
    static connect() {
        Mongoose.connect('mongodb+srv://user:pass123@cluster0.blzne.mongodb.net/Vac20?retryWrites=true&w=majority', {
            useNewUrlParser: true
        }, function (error) {
            if (!error) return;
            console.log('Falha na conexão!', error)
        })
        const connection = Mongoose.connection
        connection.once('open', () => console.log('database rodando!!'))
        return connection;
    }

    async create(item) {
        return this._collection.create(item)
    }

    async readUser(item = {}) {
        return this._collection.find(item, {
             cpf: 1, 
             firstName: 1, 
             lastName: 1, 
             dob:1, 
             password:1, 
             insertedAt: 1, 
             image: 1, 
             vacStatus: 1, 
             contaminated: 1})
    }

    async updateUser(_cpf, item) {
        return this._collection.updateOne({cpf: _cpf}, { $set: item})
    }

    async deleteUser(_cpf) {
        return this._collection.deleteOne({cpf: _cpf})
    }

    async readVac(item = {}) {
        return this._collection.find(item, { cpf: 1, id: 1, description: 1, shots:1,  image:1, date:1, insertedAt: 1})
    }

    async updateVac(_id, _cpf, item) {
        return this._collection.updateOne({id: _id, cpf: _cpf}, { $set: item})
    }

    async disapproveVac(_id, _cpf, item) {
        return this._collection.updateOne({id: _id, cpf: _cpf, repproved: false}, { $set: item})
    }

    async deleteVac(_id, _cpf) {
        return this._collection.deleteOne({id: _id, cpf: _cpf})
    }

    async approveVac(_id,_cpf) {
        return this._collection.deleteOne({id: _id, cpf: _cpf, repproved: false})
    }

    async readBusiness(item = {}) {
        return this._collection.find(item, {
             cnpj: 1 , 
             password: 1, 
             name: 1,
             description: 1, 
             addressStreet: 1, 
             addressNumber: 1, 
             addressComplement: 1,
             addressCity: 1,
             addressState: 1,
             addressCountry:1,
             addressCode: 1,
             insertedAt: 1})
    }

    async updateBusiness(_cnpj, item) {
        return this._collection.updateOne({cnpj: _cnpj}, { $set: item})
    }

    async deleteBusiness(_cnpj) {
        return this._collection.deleteOne({cnpj: _cnpj})
    }

    async readVisit(item = {}) {
        return this._collection.find(item, {cnpj: 1, cpf: 1, insertedAt:1})
    }
}

module.exports = MongoDB