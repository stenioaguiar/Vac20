const Mongoose=  require('mongoose')
const userSchema = new Mongoose.Schema({
    cpf: {
        type: String,
        required: true,
        unique: true
    },
    password:
    {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: false
    },
    image: {
        type: String
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})

//mocha workaround
module.exports = Mongoose.models.user || Mongoose.model('user', userSchema)