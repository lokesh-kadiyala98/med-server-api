const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const express = require('express')
const router = express.Router()

const DBurl = 'mongodb://localhost:27017';

router.get('/', (req, res) => {
    res.send('<h1>Hello, pharma.js</h1>')
});

router.get('/get_unique_medicines', (req, res) => {
    MongoClient.connect(DBurl, (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            db.collection('medicines').distinct('name', (err, items) => {
                if(err)
                    res.status(400).send(err)
                else{
                    res.status(200).send(items)
                }
            })
        }
    })
})

module.exports = router