const mongodb = require('mongodb')
const express = require('express')
const csv = require('csvtojson')
const MongoClient = mongodb.MongoClient;

const DBurl = 'mongodb://localhost:27017';

function getDiseaseSymptoms(req, res) {
    // csv()
    // .fromFile('disease_symptoms.csv')
    // .then((jsonObj)=>{
    //     var disease = {}
    //     jsonObj.forEach((obj) => {
    //         if(obj['Disease'] !== '') {
    //             diseaseName = obj['Disease']
    //             disease[diseaseName] = { 'symptoms': [], 'occurence': obj['Occurrence']}
    //             disease[obj['Disease']].symptoms.push(obj['Symptom'])
    //         } else {
    //             disease[diseaseName].symptoms.push(obj['Symptom'])
    //         }
    //     })
    MongoClient.connect(DBurl, (err, client) => {
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
    //})
}

function getUniqueSymptoms(req, res) {
    MongoClient.connect(DBurl, (err, client) => {
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
    MongoClient.connect(DBurl, (err, client) => {
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
        
        MongoClient.connect(DBurl, (err, client) => {
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