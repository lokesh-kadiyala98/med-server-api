const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const express = require('express')
const router = express.Router()
const cheerio = require('cheerio')
const request = require('request')
const schedule = require('node-schedule')

const DBurl = 'mongodb://localhost:27017';

router.get('/', (req, res) => {
    res.send('<h1>Hello, corona_stats.js</h1>')
});

router.get('/get_data', (req, res) => {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, async (err, client) => {
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

schedule.scheduleJob('9 8 * * *', async () => {
    const result = await updateINData()

    console.log(result)
})

function updateINData() {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            url: 'https://www.mohfw.gov.in/#state-data'
        }, (err, res, body) => {
            if (err) 
                reject(err)

            let $ = cheerio.load(body);
            let states = [], cases = [], cured = [], deceased = []
            $('.table-striped tbody tr td').each(function(i) {
                if(i % 5 === 1)
                    states.push($(this).text().trim())
                else if(i % 5 === 2)
                    cases.push($(this).text().trim())
                else if(i % 5 === 3)
                    cured.push($(this).text().trim())
                else if(i % 5 === 4)
                    deceased.push($(this).text().trim())
            })
            for (let index = 0; index < states.length - 1; index++) {
                let obj = {
                    state: states[index],
                    cases: parseInt(cases[index]),
                    cured: parseInt(cured[index]),
                    deceased: parseInt(deceased[index])
                }
                MongoClient.connect(DBurl, {useUnifiedTopology: true}, (err, client) => {
                    if (err)
                        reject({ error: 'Database Connection: Seems like something went wrong!!' })
                    else {
                        const db = client.db('med')
                        db.collection('corona_data_in_states').updateOne({state: states[index]}, {$set: obj}, (err, res) => {
                            if (err) 
                                reject(err)
                        })
                    }
                })
            }
            resolve({status: 200, message: 'No errors'})
        })
    })
}

function updateWorldData() {
    return new Promise((resolve, reject) => {
        request({
            method: 'GET',
            url: 'https://www.mohfw.gov.in/#state-data'
        }, (err, res, body) => {
            if (err) 
                reject(err)

            let $ = cheerio.load(body);
            let states = [], cases = [], cured = [], deceased = []
            $('.table-striped tbody tr td').each(function(i) {
                if(i % 5 === 1)
                    states.push($(this).text().trim())
                else if(i % 5 === 2)
                    cases.push($(this).text().trim())
                else if(i % 5 === 3)
                    cured.push($(this).text().trim())
                else if(i % 5 === 4)
                    deceased.push($(this).text().trim())
            })
            for (let index = 0; index < states.length - 1; index++) {
                let obj = {
                    state: states[index],
                    cases: parseInt(cases[index]),
                    cured: parseInt(cured[index]),
                    deceased: parseInt(deceased[index])
                }
                MongoClient.connect(DBurl, {useUnifiedTopology: true}, (err, client) => {
                    if (err)
                        reject({ error: 'Database Connection: Seems like something went wrong!!' })
                    else {
                        const db = client.db('med')
                        db.collection('corona_data_in_states').updateOne({state: states[index]}, {$set: obj}, (err, res) => {
                            if (err) 
                                reject(err)
                        })
                    }
                })
            }
            resolve({status: 200, message: 'No errors'})
        })
    })
}

router.get('/update_state_wise_data', async (req, res) => {
    const result = await updateINData()
    res.send(result)
})

router.get('/get_state_wise_data', async (req, res) => {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, (err, client) => {
        if (err)
            reject({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            db.collection('corona_data_in_states').find().toArray((err, items) => {
                if(err)
                    res.status(400).send({ error: err.message })
                else
                    res.status(200).send({ items })
            })
        }
    })
})

module.exports = router