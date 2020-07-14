const express = require('express')
const router = express.Router()
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const jwt = require('jsonwebtoken')

const Admin = require('../models/admin')

const DBurl =  process.env.DBurl;

router.post('/user_register', (req, res) => {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, async (err, client) => {
        if (err)
            res.send({ error: 'Database Connection: Seems like something went wrong!!' })
        else {
            const db = client.db('med')
            const user = await db.collection('users').findOne({ username: req.body.username })
            if(user)
                return res.status(400).send({ error: 'User already exists' })
            else {
                db.collection("users").insertOne(req.body, async (err) => {
                    if (err)
                        res.status(400).send({ error: err.message })
                    else{
                        const user = await db.collection('users').findOne({ $and: [{ username: req.body.username }, {password: req.body.password}] })
                        if(user)
                            jwt.sign({user}, 'sushh', (err, token) => {
                                return res.status(200).send({token})
                            })
                    }
                })
            }
        }
    })
})

router.post('/user_login', (req, res) => {
    MongoClient.connect(DBurl, {useUnifiedTopology: true}, async (err, client) => {
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

// if (e.code === 11000)
// res.status(400).send({ message: "User with same email exists"})
// else
// res.status(500).send()

module.exports = router