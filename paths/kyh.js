const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const express = require('express')
const router = express.Router()

 
const DBurl =  process.env.DBurl;

router.get('/', (req, res) => {
    res.send('<h1>Hello, kyh.js</h1>')
});

router.post('/kyh_save_data', (req, res) => {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, async (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            db.collection("kyh_datas").insertOne(req.body, (err) => {
                if (err)
                    res.status(400).send({ error: err.message })
                else
                    res.status(200).send({ message: 'Data Saved!!' })
            })
        }
        
    })
})

router.post('/get_user_kyh_data', (req, res) => {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            db.collection('kyh_datas').find({ userID: req.body.userID }).toArray((err, items) => {
                if(err)
                    res.status(400).send({ error: err.message })
                else
                    res.status(200).send({ items })
            })
        }
        
    })
})

router.get('/get_ageGrp_average', (req, res) => {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            db.collection('kyh_datas').aggregate([
                {
                    $match: {
                        ageGrp: parseInt(req.query.ageGrp)
                    }
                },
                {
                    $group: {
                        _id: '$ageGrp',
                        count: {$sum: 1},
                        avgScore: {$avg: '$score'}
                    }
                }
            ]).toArray((err, items) => {
                if(err)
                    res.status(400).send({ error: err.message })
                else
                    res.status(200).send({ items })
            })
        }
    })
})

router.get('/get_users_average', (req, res) => {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            db.collection('kyh_datas').aggregate([
                {
                    $group: {
                        _id: null,
                        avgScore: {$avg: '$score'},
                        count: {$sum: 1}
                    }
                }
            ]).toArray((err, items) => {
                if(err)
                    res.status(400).send({ error: err.message })
                else
                    res.status(200).send({ items })
            })
        }
    })
})

module.exports = router