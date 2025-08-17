const mongoose = require("mongoose");
const initData= require("./data.js");
const Listing = require("../models/listing.js");
if(process.env.NODE_ENV != "production"){//We ususally remove this while in production
require("dotenv").config()
}


const dbUrl=process.env.ATLASDB_URL
main()

  .then(async () => {
    
    console.log("connection successful");
    await initDb(); // Await here
    mongoose.connection.close(); // Optionally close connection after
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const initDb = async()=>{
    await Listing.deleteMany({});
    //To initalise the owner to every dataset when can call the data array 
    //... it (means copy the entire array) and add the owner id to it
    //map function makes a new array doest the change the array 
    initData.data=initData.data.map((obj)=>({...obj,owner: "68a19cd25b18115c58a0c872"}))
    await Listing.insertMany(initData.data);
    console.log("data was was initialised");

};
