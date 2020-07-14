const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const express = require('express')
const router = express.Router()
const schedule = require('node-schedule')

const Covid_IN_stat = require('../models/covid_IN_stat')
const covid_IN_data_scrapper = require('../scrappers/covid_IN_data_scrapper')

const DBurl =  process.env.DBurl

router.get('/get_data', (req, res) => {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, async (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            db.collection('corona_cases_data').aggregate([
                {
                    $project: {
                        totalCases: 1, 
                        totalDeaths: 1, 
                        recoveredOnDay: 1, 
                        date: 1,
                        day: {
                            $substr: ['$date', 0, 2]
                        },
                        month: {
                            $substr: ['$date', 3, 2]
                        }
                    }
                }, {
                    $sort: {
                        month: 1, 
                        day: 1
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

router.get('/get_unique_states', (req, res) => {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, async (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            db.collection('corona_data_in_states').distinct('state', (err, items) => {
                if(err)
                    res.status(400).send({ error: err.message })
                else
                    res.status(200).send(items)
            })
        }
    })
})

router.get('/get_state_data', (req, res) => {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, async (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            db.collection('corona_data_in_states').find({ state: req.query.state }).toArray((err, items) => {
                if(err)
                    res.status(400).send({ error: err.message })
                else
                    res.status(200).send(items)
            })
        }
    })
})

schedule.scheduleJob('1 * * * * *', async () => {
    console.log('hi')
})

router.patch('/IN', async (req, res) => {
    try {
        const result = await covid_IN_update_scrapper()
        
        if (result.status === 200)
            result.data.forEach(async (element) => {
                await Covid_IN_stat.findOneAndUpdate({ state: element.state }, { element })
            })

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/update_data', (req, res) => {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, (err, client) => {
        if(err)
            res.send({ error: err.message })
        else {
            const db = client.db('med')
            db.collection('corona_cases_data').insertOne({ 
                totalCases: parseInt(req.query.cases), 
                totalDeaths: parseInt(req.query.deaths), 
                recoveredOnDay: parseInt(req.query.recovered), 
                date: req.query.date 
            }, (err) => {
                if (err)
                    res.send({ error: err.message })
                else    
                    res.send({ status: 200, message: 'No errors'})
            })
        }    
    })
})

router.get('/IN', async (req, res) => {
    try {
        const data = await Covid_IN_stat.find().sort({ state: 1 })
        
        res.send(data)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router