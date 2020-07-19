const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const express = require('express')
const router = express.Router()
const schedule = require('node-schedule')

const Covid_IN_stat = require('../models/covid_IN_stat')
const covid_IN_data_scrapper = require('../scrappers/covid_IN_data_scrapper')

const DBurl =  process.env.DBurl

router.get('/IN/timeseries_data', (req, res) => {
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

router.get('/unique_states', (req, res) => {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, async (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            db.collection('covid_19_in_stats').distinct('state', (err, items) => {
                if(err)
                    res.status(400).send({ error: err.message })
                else
                    res.status(200).send(items)
            })
        }
    })
})

router.get('/state_data', async (req, res) => {
    try {
        const data = await Covid_IN_stat.findOne({ state: req.query.state })

        if (!data)
            res.status(404).send({ message: "State not found" })
        
        res.send(data)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/IN', async (req, res) => {
    try {
        const result = await covid_IN_data_scrapper()

        if (result.status === 200)
            result.data.forEach(async (element) => {
                //Mongoose's findOneAndUpdate() long pre-dates the MongoDB driver's findOneAndUpdate() function, so it uses the MongoDB driver's findAndModify()
                //function instead. You can opt in to using the MongoDB driver's findOneAndUpdate() function using the useFindAndModify
                await Covid_IN_stat.findOneAndUpdate({ state: element.state }, element, { useFindAndModify: false })
            })

        res.send({ message: "200 OK" })
    } catch (e) {
        console.log(e)
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