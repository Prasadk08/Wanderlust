const express = require('express')
const router = express.Router({mergeParams:true})
const review = require('../models/review')
const wrapAsync = require('../utils/wrapAsync.js')
const expressError= require('../utils/expressError')
const listing = require('../models/listing')
const {validateReview, isLoggedIn,isReviewAuthor}= require('../middleware.js')
const reviewcontroller = require('../controllers/review')

// Review
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewcontroller.viewreview))

router.delete("/:revid",
    isReviewAuthor,
    wrapAsync(reviewcontroller.destroyreview))

module.exports = router