const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
const PORT = process.env.PORT || 5000

var disease_symptoms = require('../paths/disease_symptoms')
var users = require('../paths/users')
var kyh = require('../paths/kyh')

app.get('/', (req, res) => {
    res.send('<h1>Hello, app.js</h1>')
});

app.use('/disease_symptoms', disease_symptoms)

app.use('/users', users)

app.use('/kyh', kyh)

app.listen(PORT, () => {
    console.log('Example app listening on port ', PORT)
});