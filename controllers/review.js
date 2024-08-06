const listing = require('../models/listing')
const review = require('../models/review')

module.exports.viewreview=async(req,res)=>{
    let dest = await listing.findById(req.params.id)
    let newReview = new review(req.body.review)
    newReview.author=req.user._id;
    dest.review.push(newReview)

    await newReview.save()
    await dest.save()
    req.flash("success","New Review Created")
    res.redirect(`/listing/${dest._id}`)
}

module.exports.destroyreview=async(req,res)=>{
    let{id,revid}=req.params
    await listing.findByIdAndUpdate(id,{$pull:{review:revid}})
    await review.findByIdAndDelete(revid)
    req.flash("success","Review Deleted Succesfully")
    res.redirect(`/listing/${id}`);
}