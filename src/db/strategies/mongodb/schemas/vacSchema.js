const Mongoose=  require('mongoose')
const vacSchema = new Mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    cpf:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    shots: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})

//mocha workaround
module.exports = Mongoose.models.vac || Mongoose.model('vac', vacSchema)