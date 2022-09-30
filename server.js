require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')


mongoose.connect(process.env.DATABASE_URL , 
    { 
    useNewUrlParser: true 
    }
)

app.use(express.json())

const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))

app.get('/', (req, res) => {
    res.send('Api is running test 10')
})

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

app.listen(process.env.PORT || 8000, () => console.log("Server is running"))