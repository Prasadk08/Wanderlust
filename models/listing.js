const mongoose = require('mongoose')
const review = require('./review')

let defaultImages=["https://www.holidify.com/images/cmsuploads/compressed/Venkateshwara_Tirupati_Temple_20190712064011.jpg",
    "https://cdn.britannica.com/12/136912-050-58299570/Tower-Bridge-River-Thames-London.jpg",
    "https://www.swantour.com/blogs/wp-content/uploads/2018/02/Tourist-Places-in-Bangalore.jpg"
]

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    url:{
        type:String,
        // default:defaultImages[Math.floor(Math.random()*(2))],
        set: (v) => v==="" || null
        ? defaultImages[Math.floor(Math.random()*(3))]
        :v,
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    review:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.review}})
    }
})

const listing = mongoose.model("listing",listingSchema)

module.exports=listing
