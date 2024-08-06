const listing = require('./models/listing');
const review = require('./models/review');
const {reviewSchema,listingSchema} = require("./schema")

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must me signed In")
        res.redirect("/login")
    }else{
        next();
    }

}

module.exports.userPath = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    const {id}=req.params
    let listingnew=await listing.findById(id)
    if(!listingnew.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of this listing")
        return res.redirect(`/listing/${id}`)
    }
    next()
}

module.exports.validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body)
    if(error){
        const errmsg = error.details.map((el)=> el.message ).join(",")
        throw new expressError(400,errmsg)
    }else{
        next()
    }

}

module.exports.validateReview=(req,res,next)=>{
    const {error}= reviewSchema.validate(req.body)
    if(error){
        const errmsg = error.details.map((el)=> el.message ).join(",")
        throw new expressError(400,errmsg)
    }else{
        next()
    }
}


module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,revid}=req.params
    let reviewNew=await review.findById(revid)
    if(!reviewNew.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not author of this review")
        return res.redirect(`/listing/${id}`)
    }
    next()
}