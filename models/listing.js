// const mongoose = require("mongoose");
// const schema = mongoose.Schema;

// const listingSchema = new schema({
//     title :{
//         type: String,
//         required: true
//     },
//     description:String,
//     image:{
//         type:String,
//         default:"https://unsplash.com/photos/the-sun-is-shining-over-the-water-and-rocks-CIuhewxFdxU",
//        // required:true,
//         //set:(v) => v === "" ? "https://unsplash.com/photos/the-sun-is-shining-over-the-water-and-rocks-CIuhewxFdxU" : v
//     },
//     price:Number,
//     location:String,
//     country:String,
// });

// const Listing = mongoose.model("Listing",listingSchema);

// module.exports = Listing;



const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema; // Capitalized 'Schema'

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

listingSchema.post("findOneAndDelete", async (listing)=>{
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });  
    }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
