const Listing = require("../models/listing")
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    let { id } = req.params;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("Saved")
    req.flash("success","Added a review");
    res.redirect(`/listings/${id}`);

}

module.exports.deleteReview = async(req,res)=>{
    let {id,reviewsId} = req.params;

    //  console.log("Listing ID:", id);
    //  console.log("Review ID:", reviewsId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewsId}})
    await Review.findByIdAndDelete(reviewsId);
    req.flash("success","Deleted review");
    res.redirect(`/listings/${id}`);
}