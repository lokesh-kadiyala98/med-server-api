const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const KYHData = require('../models/knowYourHeart')

const DBurl = 'mongodb://localhost:27017';


router.get('/', (req, res) => {
    res.send('<h1>Hello, users.js</h1>')
});

router.post('/user_register', (req, res) => {
    MongoClient.connect(DBurl, async (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            const user = await db.collection('users').findOne({ username: req.body.username })
            if(user)
                return res.status(400).send({ error: 'User already exists' })
            else {
                const user = new User(req.body)

                user.save().then(() => {
                    jwt.sign({user}, 'sushh', (err, token) => {
                        res.send({token})
                    })
                }).catch((err) => {
                    res.status(400).send({ error: err.message})
                })
            }
        }
    })
})

router.post('/user_login', (req, res) => {
    MongoClient.connect(DBurl, async (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            const user = await db.collection('users').findOne({ $and: [{ username: req.body.username }, {password: req.body.password}] })
            if(user)
                jwt.sign({user}, 'sushh', (err, token) => {
                    return res.status(200).send({token})
                })
            else {
                res.status(400).send({ error: 'Username and Password doesn\'t match'})
            }
        }
    })
})

router.post('/kyh_save_data', (req, res) => {
    MongoClient.connect(DBurl, async (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const kyh = new KYHData(req.body)
            kyh.save().then(() => {
                res.status(200).send({ message: 'Data Saved!!' })
            }).catch((err) => {
                res.status(400).send({ error: err.message })
            })
        }
        
    })
})

router.post('/get_user_kyh_data', (req, res) => {
    MongoClient.connect(DBurl, (err, client) => {
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

module.exports = router