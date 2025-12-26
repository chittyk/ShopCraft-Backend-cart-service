require('dotenv').config()
const express = require("express")
const cors =require('cors')
const connnectDb = require('./src/config/db')
const router = require('./src/routes/router')

const app = express()
app.use(express.json())
app.use(cors())

//connnect db
connnectDb()

app.use('/api/cart',router)

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log("cart server is nunning at port" , PORT)
})