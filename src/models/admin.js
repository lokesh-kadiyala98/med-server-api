const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

adminSchema.methods.toJSON = function() {
    const admin = this

    const adminObject = admin.toObject()

    delete adminObject.password

    return adminObject
}

adminSchema.methods.genetateAuthToken = async function() {
    const admin = this

    const token = jwt.sign({ _id: admin._id.toString() }, 'sushhh')

    admin.tokens = admin.tokens.concat({ token })
    await admin.save()

    return token
}

adminSchema.statics.findByCredentials = async (username, password) => {
    const admin = await Admin.findOne({ username })

    if (!admin)
        throw new Error('Admin not found')
    
    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch)
        throw new Error('Admin username & password doesn\'t match')

    return admin
}

adminSchema.pre('save', async function (next) {
    const admin = this

    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 4)
    }
    next()
})

const Admin = new mongoose.model('Admin', adminSchema)

module.exports = Admin