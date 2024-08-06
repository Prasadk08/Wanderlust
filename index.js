if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user.js')
const expressError = require('./utils/expressError.js')


const listingRoute = require('./router/listing.js')
const reviewRoute = require('./router/review.js')
const userRoute = require("./router/user.js")

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


const port = 8080

app.listen(port,()=>{
    console.log("listening on port 8080")
})

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate );

const sessionOption={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}

app.use(session(sessionOption))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user;
    next()
})


app.use("/listing",listingRoute)
app.use("/listing/:id/review",reviewRoute)
app.use("/",userRoute)


app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page Not Found!"))
})

app.use((err,req,res,next)=>{
    let{status=500,message="Something Went Wrong"}=err
    res.status(status).render("error.ejs",{message})
    // res.status(status).send(message)
})
