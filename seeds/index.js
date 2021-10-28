const mongoose = require("mongoose");
const Campground = require("../model/campground");
const cities = require("./cities");
const {places, descriptors} = require('./seedHelpers')

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const findRandom = array => array[Math.floor(Math.random()* array.length)];

const seedDB = async _=>{
    await Campground.deleteMany({});
    for(let i = 0; i <= 50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campground({
          title: `${findRandom(descriptors)} ${findRandom(places)}`,
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
        });
        await camp.save();
    }

}

seedDB().then(_=>{
    mongoose.connection.close();
});