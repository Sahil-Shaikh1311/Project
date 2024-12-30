const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing  = require("../models/listing.js");

main()
.then((res)=>{
    console.log("connection successfull");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
      ...obj,
      owner:"67714f22b0b2e55c91b987b5",
    }))
    await Listing.insertMany(initData.data);
    console.log("data inserted");

}

initDB();

