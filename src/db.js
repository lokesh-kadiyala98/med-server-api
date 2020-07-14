const mongoose = require('mongoose')

mongoose.connect(process.env.DBurl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})