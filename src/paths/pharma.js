const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const express = require('express')
const router = express.Router()

const adminAuth = require('../middleware/adminAuth')

const DBurl =  process.env.DBurl

router.get('/get_unique_medicines', adminAuth, (req, res) => {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, (err, client) => {
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

router.get('/get_unique_brands', adminAuth, (req, res) => {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            db.collection('medicines').distinct('brand', (err, items) => {
                if(err)
                    res.status(400).send(err)
                else{
                    res.status(200).send(items)
                }
            })
        }
    })
})

router.get('/get_medicine_timeseries_data', adminAuth, (req, res) => {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            db.collection('medicines').aggregate(
                [
                    {
                        $match: { name: req.query.toForecast }
                    },
                    {
                        $lookup: 
                        {
                            from: 'sales',
                            localField: '_id',
                            foreignField: 'medicineId',
                            as: 'sales'
                        }
                    },
                    {
                        $unwind:'$sales'
                    },
                    {
                        $group: 
                        {
                            _id: { $substr: ['$sales.date', 3, 7] },
                            count: { $sum: '$sales.units' }
                        }
                    },
                    {
                        $project: 
                        {
                            count: 1,
                            month: { $substr: ['$_id', 0, 2] }, 
                            year: { $substr: ['$_id', 3, 4] }
                        }
                    },
                    {   
                        $sort: 
                        { 
                            year: 1, 
                            month: 1 
                        } 
                    }
                ]
            ).toArray((err, items) => {
                if(err)
                    res.status(400).send(err)
                else{
                    res.status(200).send(items)
                }
            })
        }
    })
})


router.get('/get_brand_timeseries_data', adminAuth, (req, res) => {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            db.collection('medicines').aggregate(
                [
                    {
                        $match: { brand: req.query.toForecast }
                    },
                    {
                        $lookup: 
                        {
                            from: 'sales',
                            localField: '_id',
                            foreignField: 'medicineId',
                            as: 'sales'
                        }
                    },
                    {
                        $unwind:'$sales'
                    },
                    {
                        $group: 
                        {
                            _id: { $substr: ['$sales.date', 3, 7] },
                            count: { $sum: '$sales.units' }
                        }
                    },
                    {
                        $project: 
                        {
                            count: 1,
                            month: { $substr: ['$_id', 0, 2] }, 
                            year: { $substr: ['$_id', 3, 4] }
                        }
                    },
                    {   
                        $sort: 
                        { 
                            year: 1, 
                            month: 1 
                        } 
                    }
                ]
            ).toArray((err, items) => {
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