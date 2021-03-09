const Mongoose=  require('mongoose')
const approveSchema = new Mongoose.Schema({
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
    repproved:{
        type: Boolean
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})

//mocha workaround
module.exports = Mongoose.models.approve || Mongoose.model('approve', approveSchema)