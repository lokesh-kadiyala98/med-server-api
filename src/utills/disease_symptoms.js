const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;

 
const DBurl =  process.env.DBurl;

function getDiseaseSymptoms(req, res) {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            db.collection('disease_symptoms').find().toArray((err, items) => {
                if (err) {
                    res.send({ error: 'Some error in disease_symptoms.js', err })
                }
                else {
                    res.send(items)
                }
            })
        }
    })
}

function getUniqueSymptoms(req, res) {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            db.collection('disease_symptoms').distinct('symptoms', (err, items) => {
                if(err)
                    res.send(err)
                else{
                    res.send(items)
                }
            })
        }
    }) 
}

function getDiseaseSymptomsModel(req, res) {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            db.collection('disease_symptoms_LSTM_classifier').find().toArray((err, items) => {
                if(err)
                    res.send(err)
                else{
                    res.send(items)
                }
            })
        }
    })
}

function getRelatedSymptoms(req, res) {
    if(req.body.symptoms){
        var queryString = '{"$and":[{"symptoms":"'
        queryString += req.body.symptoms.split(', ').join('"}, {"symptoms":"')
        queryString += '"}]}'
        
        MongoClient.connect(DBurl, {useUnifiedTopology: true}, (err, client) => {
            if (err)
                res.send({ error: 'Database Connection: Seems like something went wrong!!' })
            else {
                const db = client.db('med')
                db.collection('disease_symptoms').distinct('symptoms', JSON.parse(queryString), { symptoms: true }, (err, items) => {
                    if(err)
                        res.send(err.message)
                    else{
                        res.send(items)
                    }
                })
            }
        })
    } else {
        res.send({ error: 'Needs minimum symptoms' })
    }
}

module.exports = { 
    getDiseaseSymptoms,
    getUniqueSymptoms,
    getDiseaseSymptomsModel,
    getRelatedSymptoms
}