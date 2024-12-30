const express = require("express");
const router = express.Router({ mergeParams:true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../Schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn,isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/review.js");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


//create route
router.post("/", validateReview,isLoggedIn, wrapAsync(reviewController.createReview));

//Delete review route
router.delete("/:reviewsId" ,isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))

module.exports = router
