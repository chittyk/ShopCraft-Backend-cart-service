const mongoose = require('mongoose')

const connnectDb = ()=>{
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("cart db is connected successfuly");
    })
    .catch((error)=>{
        console.log("cart is not connected due to :" ,error)
    })
}

module.exports =  connnectDb