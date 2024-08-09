const express = require('express')
const router = express.Router({mergeParams:true})
const wrapAsync = require('../utils/wrapAsync.js')
const expressError= require('../utils/expressError')
const listing = require('../models/listing')
const review = require('../models/review')
const {isLoggedIn, isOwner,validateListing}= require('../middleware.js')
const listingcontroller = require('../controllers/listing.js')
const multer  = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({ storage })


router.route("/:id/edit")
    .get(
        isLoggedIn,
        isOwner,
        wrapAsync(listingcontroller.rendereditform)
    )
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingcontroller.updatelisting)
    )


router.route("/new")
    .get(isLoggedIn,listingcontroller.rendernewform)
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingcontroller.newlisting)
    )
    // .post(upload.single('listing[url]'),(req,res)=>{
    //     res.send(req.file)
    // })


router.route("/:id")
    .get(
        wrapAsync(listingcontroller.showlisting)
    )
    .delete(
        isOwner,
        wrapAsync(listingcontroller.destroylisting)
    )

module.exports = router