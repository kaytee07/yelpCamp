const mongoose = require('mongoose');
const schema = mongoose.Schema;

const campgroundSchema = new schema({
    title: String,
    price:String,
    description: String,
    location:String
});

module.exports = mongoose.model('Campground', campgroundSchema);