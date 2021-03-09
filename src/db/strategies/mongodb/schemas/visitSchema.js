const Mongoose=  require('mongoose')
const visitSchema = new Mongoose.Schema({
    cnpj: {
        type: String,
        required: true
    },
    cpf:{
        type: String,
        required: true,
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})

//mocha workaround
module.exports = Mongoose.models.visit || Mongoose.model('visit', visitSchema)