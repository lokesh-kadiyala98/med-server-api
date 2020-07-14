const mongoose = require('mongoose')

const Covid_IN_stat = new mongoose.model('covid_19_IN_stat', {
    state: {
        type: String,
        required: [true, 'State is required field'],
        unique: true
    },
    cases: {
        type: Number,
        required: [true, 'Cases is required field']
    },
    cured: {
        type: Number,
        required: [true, 'Cured is required field']
    },
    deceased: {
        type: Number,
        required: [true, 'Deceased is required field']
    }
})

module.exports = Covid_IN_stat