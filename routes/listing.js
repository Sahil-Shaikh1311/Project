const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../Schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const listingController = require("../controllers/listing.js");

const {storage} = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({storage})

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


//index route
router.get("/",wrapAsync(listingController.index));

//New route
router.get("/new", isLoggedIn, listingController.renderNewForm)

//show route
router.get("/:id", listingController.showListing)


//create route
router.post("/", isLoggedIn, upload.single('listing[image]'), wrapAsync(listingController.createListing));

// router.post("/",,(req,res)=>{
//     res.send(req.file)
// })

//edit route
router.get("/:id/edit", isLoggedIn,  listingController.editListing);

//update route
router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), listingController.updateListing)

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, listingController.deleteListing)


module.exports = router;


