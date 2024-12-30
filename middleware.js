const Listing = require("./models/listing")
const Review = require("./models/review");


module.exports.isLoggedIn = (req,res,next) =>{
   // console.log(req.user ,"...",req.originalUrl );
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you are not logged in")
       return  res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
   // console.log(listing.owner);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit")
       return res.redirect(`/listings/${id}`)
    }
    next();
    
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let { id,reviewsId } = req.params;
    let review = await Review.findById(reviewsId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You cannot delete review")
       return res.redirect(`/listings/${id}`)
    }
    next();
    
}