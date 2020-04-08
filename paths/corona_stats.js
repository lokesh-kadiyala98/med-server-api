const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const express = require('express')
const router = express.Router()

const DBurl = 'mongodb://localhost:27017';

router.get('/', (req, res) => {
    res.send('<h1>Hello, corona_stats.js</h1>')
});

router.get('/get_corona_data', (req, res) => {
    MongoClient.connect(DBurl, async (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            db.collection('corona_cases_data').find().toArray((err, items) => {
                if(err)
                    res.status(400).send({ error: err.message })
                else
                    res.status(200).send({ items })
            })
        }
    })
})

module.exports = router