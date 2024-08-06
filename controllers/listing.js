
const listing = require("../models/listing")


module.exports.index = async (req,res)=>{
    const listingall = await listing.find({})
    res.render("listings/index.ejs",{listingall})
}

module.exports.rendernewform =  (req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.showlisting = async(req,res)=>{
    const {id}=req.params;
    const data=await listing.findById(id)
    .populate({path:"review",
        populate:{
            path:"author"
        }
    })
    .populate("owner")

    if(!data){
        req.flash("error","Requested Listing does not Exist")
        res.redirect("/listing")
    }
    else{
        res.render("listings/show.ejs",{data})
    }
}

module.exports.newlisting= async(req,res,next)=>{

    res.send(req.file)
    // let listingnew=req.body.listing
    // let data=new listing(listingnew)
    // data.owner=req.user._id;
    // await data.save()
    // req.flash("success","New Listing Created")
    // res.redirect("/listing")
}

module.exports.rendereditform =async(req,res)=>{
    const {id}=req.params
    let data= await listing.findById(id)

    if(!data){
        req.flash("error","Requested Edit Listing does not Exist")
        res.redirect("/listing")
    }else{
        res.render("listings/edit.ejs",{data})
    }
}

module.exports.updatelisting=async(req,res)=>{
    const {id}=req.params

    await listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash("success","Listing Updated Succesfully")
    res.redirect("/listing")
}

module.exports.destroylisting=async(req,res)=>{
    const{id}=req.params
    await listing.findByIdAndDelete(id)
    await review.deleteMany({})
    req.flash("success","Listing Deleted Succesfully")
    res.redirect("/listing")
}