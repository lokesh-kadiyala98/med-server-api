const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const userAuth = require('../middleware/userAuth')

router.post('/signup', async (req, res) => {
    const user = new User(req.body)
    
    try {
        await user.save()

        const token = await user.generateAuthToken()

        res.status(201).send({ user, token })
    } catch (e) {
        if (e.code === 11000)
            res.status(400).send({ error: 'User already exists' })
        else
            res.status(500).send()
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)

        if (!user)
            res.status(404).send()
        
        const token = await user.generateAuthToken()

        res.send({ user, token })
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

router.get('/logout', userAuth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)    

        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/logout_all_devices', userAuth, async (req, res) => {
    try {
        req.user.tokens = []    

        await req.user.save()

        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router