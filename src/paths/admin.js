const express = require('express')
const router = express.Router()

const Admin = require('../models/admin')
const adminAuth = require('../middleware/adminAuth')

router.post('/signup', async (req, res) => {
    const admin = new Admin(req.body)

    try {
        await admin.save()

        const token = await admin.genetateAuthToken()

        res.send({ admin, token })
    } catch (e) {
        if (e.code === 11000)
            res.status(400).send({ message: "Admin already exists"})
        else
            res.status(500).send()
    }
})

router.post('/login', async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.username, req.body.password)

        if (!admin)
            res.status(404).send()

        const token = await admin.genetateAuthToken()

        res.send({ admin, token })
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/logout', adminAuth, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter(token => token.token !== req.token)    

        await req.admin.save()

        res.send(req.admin)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.get('/logout_all_devices', adminAuth, async (req, res) => {
    try {
        admin.tokens = []    

        await admin.save()

        res.send(req.admin)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router