const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required']
    },
    dob: {
        type: String,
        required: [true, 'DOB is required']
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required']
    },
    height: {
        type: Number,
        required: [true, 'Height is required']
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    
    const token = jwt.sign({ _id: user._id.toString() }, 'sushhh')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username })
    
    if (!user)
        throw new Error('User not found')

    const isMatch = await bcrypt.compare(user.password, password)

    if (!isMatch)
        throw new Error('Username & Password doesn\'t match')

    return user
}

userSchema.pre('save', async function (next) {
    const user = this 

    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 4)

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User