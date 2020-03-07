var mongoose = require('mongoose')

const DBurl = 'mongodb://localhost:27017';

mongoose.connect(DBurl + '/med', {
    useNewUrlParser: true,
    useCreateIndex: true
})

const User = mongoose.model('User', {
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
    gender: {
        type: String
    },
    dob: {
        type: String
    },
    weight: {
        type: Number
    },
    height: {
        type: Number
    }
})

module.exports = User