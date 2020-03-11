var mongoose = require('mongoose')

const DBurl = 'mongodb://localhost:27017';

mongoose.connect(DBurl + '/med', {
    useNewUrlParser: true,
    useCreateIndex: true
})

const KYHData = mongoose.model('KYH_data', {
    gender: {
        type: Number,
    },
    age: {
        type: Number
    },
    weight: {
        type: Number
    },
    height: {
        type: Number
    },
    bmi: {
        type: String
    },
    ldl: {
        type: Number
    },
    hdl: {
        type: Number
    },
    heartDiseaseHistory: {
        type: Number
    },
    exerciseFreq: {
        type: Number
    },
    diabetic: {
        type: Number
    },
    diabeticDuration: {
        type: Number
    },
    alcohol: {
        type: Number
    },
    smoke: {
        type: Number
    },
    diet: {
        type: [Number]
    },
    ageGrp: {
        type: Number
    },
    userID: {
        type: String
    },
    score: {
        type: Number
    }
})



module.exports = KYHData