const mongoose = require("mongoose")
const initdata=require('./data.js')
const Listing =require('../models/listing.js')
const review = require('../models/review.js')


main()
    .then((res)=>{
        console.log("connection Successful")
    })
    .catch((err)=>{
        console.log("something went wrong")
    })

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/travel")
}

const demo= async ()=>{
    await Listing.deleteMany({})
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"66aa76fc5074e324d77fd2cf"}))
    await Listing.insertMany(initdata.data)
    console.log("data saved")
    
}

demo()
