const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config()
require('./db.js')

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const PORT = process.env.PORT || 5000

const disease_symptoms = require('./paths/disease_symptoms')
const user = require('./paths/user')
const admin = require('./paths/admin')
const kyh = require('./paths/kyh')
const pharma = require('./paths/pharma')
const corona_stats = require('./paths/corona_stats')

app.get('/', (req, res) => {
    res.send('<h1>Hello, World!</h1>')
})

app.use('/disease_symptoms', disease_symptoms)

app.use('/user', user)

app.use('/admin', admin)

app.use('/kyh', kyh)

app.use('/pharma', pharma)

app.use('/corona_stats', corona_stats)

app.listen(PORT, () => {
    console.log('App listening on port', PORT)
})