const express = require('express')
const app = express()
const mongoose = require('mongoose')
const route = require('./route/route')
const dotenv = require('dotenv')
dotenv.config()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

mongoose.connect(process.env.MONGO_URI)
.then(
    console.log("database connected")
)
.catch( err => console.log(err.message))


app.use('/', route)

app.listen(process.env.PORT, function(){
    console.log("My server is runing on "+ process.env.PORT)
})