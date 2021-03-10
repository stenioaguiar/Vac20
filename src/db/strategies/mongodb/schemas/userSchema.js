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
    vacStatus: {
        type: Boolean,
        default: false
    },
    contaminated: {
        type: Boolean,
        default: false
    },
    contaminationDate: {
        type: Date
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})

//mocha workaround
module.exports = Mongoose.models.user || Mongoose.model('user', userSchema)