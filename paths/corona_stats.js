const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const express = require('express')
const router = express.Router()
const cheerio = require('cheerio')
const request = require('request')

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

function updateData() {
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
                    cases: cases[index],
                    cured: cured[index],
                    deceased: deceased[index]
                }
                MongoClient.connect(DBurl, (err, client) => {
                    if (err)
                        reject({ error: 'Database Connection: Seems like something went wrong!!' })
                    else {
                        const db = client.db('med')
                        db.collection('corona_state_wise_break_down').updateOne({state: states[index]}, {$set: obj}, (err, res) => {
                            if (err) reject(err)
                        })
                    }
                })
            }
            resolve({status: 200, message: 'No errors'})
        })
    })
}

router.get('/get_corona_state_wise_data', async (req, res) => {
    const result = await updateData()
    res.send(result)
})

module.exports = router