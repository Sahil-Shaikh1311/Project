if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

console.log(process.env.SECRET);

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
//const { listingSchema, reviewSchema } = require("./Schema.js");


const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const session = require("express-session");
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


//const mongoUrl = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLASDB_URL;

main()
    .then((res) => {
        console.log("connection successfull");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);

}

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
}) 

store.on("error",()=>{
    console.log("error in mongo store",err);
})

const sessionOption = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    httpOnly: true,

};






// app.get("/", (req, res) => {
//     res.send("Working");
// })

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"stu@123",
//         username:"student"
//     })
//     let registeredUser = await User.register(fakeUser,"123");
//     res.send(registeredUser); 
// })




app.use("/listings",listingsRouter)
app.use("/listings/:id/reviews",reviewsRouter)
app.use("/",userRouter)


// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description:"By the Beach",
//         price:21000,
//         location:"Calangute Goa",
//         country:"India"
//     });
//    await sampleListing.save();
//    console.log(sampleListing);
//    res.send("Success");
// })


// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };


// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };


// //index route
// app.get("/listings", async (req, res) => {
//     let allListing = await Listing.find({});

//     res.render("listing/index.ejs", { allListing });
// })

// //New route
// app.get("/listings/new", (req, res) => {
//     res.render("listing/new.ejs");
// })

// //show route
// app.get("/listings/:id", async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");

//     res.render("listing/show.ejs", { listing });
// })


// //create route
// app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {

//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");

// })
// );

// //edit route
// app.get("/listings/:id/edit", async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);

//     res.render("listing/edit.ejs", { listing });
// })


// app.put("/listings/:id", async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`)
// })

// //Delete Route
// app.delete("/listings/:id", async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// })




//Review route.
//post review route
// app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     let { id } = req.params;
//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();
//     console.log("Saved")
//     res.redirect(`/listings/${id}`);

// })
// )

// //Delete review route

// app.delete("/listings/:id/reviews/:reviewsId" ,wrapAsync(async(req,res)=>{
//     let {id,reviewsId} = req.params;

//     //  console.log("Listing ID:", id);
//     //  console.log("Review ID:", reviewsId);
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewsId}})
//     await Review.findByIdAndDelete(reviewsId);

//     res.redirect(`/listings/${id}`);
// }))





app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})


// app.use((err, req, res, next) => {
//     const { statusCode, message } = err;
//     res.status(statusCode).send(message);
//     //res.send("something went wrong");
// })

app.use((err, req, res, next) => {
    console.error(err.stack); // Logs the stack trace for debugging
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", { message, statusCode }); // Customize your error page
});

app.listen(8080, () => {
    console.log("server is running on port 8080");
})