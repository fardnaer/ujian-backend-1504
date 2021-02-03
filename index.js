const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// main app
const app = express()

// apply middleware
app.use(cors())
app.use(bodyParser.json())

// main route
const response = (req, res) => res.status(200).send('<h1>REST API JCWM1504</h1>')
app.get('/', response)

const db = require('./database')
db.connect((err) => {
    if (err) return console.log(`Error connecting : ${err.stack}`)
    console.log(`Connected as id : ${db.threadId}`)
})

const { userRouter, movieRouter } = require('./routers')
app.use('/user', userRouter)
app.use('/movie', movieRouter)

// bind to local machine
const PORT = 2000
app.listen(PORT, () => console.log(`Connected to port: ${PORT}`))