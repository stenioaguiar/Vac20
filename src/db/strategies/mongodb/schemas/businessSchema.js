const Mongoose=  require('mongoose')
const businessSchema = new Mongoose.Schema({
    cnpj:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    addressStreet:{
        type: String,
        required: true
    },
    addressNumber:{
        type: Number,
        required: true
    },
    addressComplement:{
        type: Number
    },
    addressCity:{
        type: String,
        required: true
    },
    addressState:{
        type: String,
        required: true
    },
    addressCountry:{
        type: String,
        required: true
    },
    addressCode:{
        type: String,
        required: true
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})

//mocha workaround
module.exports = Mongoose.models.business || Mongoose.model('business', businessSchema)