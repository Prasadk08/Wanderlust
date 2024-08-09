
const listing = require("../models/listing")
const review = require("../models/review")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });



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
        res.redirect("/")
    }
    else{
        res.render("listings/show.ejs",{data})
    }
}

module.exports.newlisting= async(req,res,next)=>{
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()

    let url=req.file.path
    let filename=req.file.filename
    let listingnew=req.body.listing
    let data=new listing(listingnew)
    data.owner=req.user._id;
    data.image={url,filename}
    data.geometry=response.body.features[0].geometry;
    let test = await data.save()
    req.flash("success","New Listing Created")
    res.redirect("/")
}

module.exports.rendereditform =async(req,res)=>{
    const {id}=req.params
    let data= await listing.findById(id)

    if(!data){
        req.flash("error","Requested Edit Listing does not Exist")
        res.redirect("/")
    }else{
        res.render("listings/edit.ejs",{data})
    }
}

module.exports.updatelisting=async(req,res)=>{
    const {id}=req.params

    let editlisting=await listing.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file != "undefined"){
        let url = req.file.path
        let filename = req.file.filename
        let image = { url, filename };
        editlisting.image = image;
        await editlisting.save();
    }
    req.flash("success","Listing Updated Succesfully")
    res.redirect("/")
}

module.exports.destroylisting=async(req,res)=>{
    const{id}=req.params
    await listing.findByIdAndDelete(id)
    await review.deleteMany({})
    req.flash("success","Listing Deleted Succesfully")
    res.redirect("/")
}