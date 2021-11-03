const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const Joi = require('joi');
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose');
const {Schema} = require('./utils/Schemas')
const Campground = require('./model/campground.js'); 
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const { stat } = require('fs');

const PORT = 8080;

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',()=>{
    console.log('Database connected')
});

app.engine("ejs", ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));


app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res)=>{
    res.render('home')
})

const validateCampground = (req, res, next)=>{
   const { error } = Schema.validate(req.body);
   if (error) {
     const msg = error.details.map((err) => err.message);
     throw new ExpressError(msg, 400);
   }else{
     next()
   }
}

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds",validateCampground, catchAsync(async (req, res, next) => {
    let campground = new Campground(req.body.campgrounds);
    await campground.save();
   res.redirect('/campgrounds'); 
}));

app.get("/campgrounds", catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}));

app.get('/campgrounds/:id', catchAsync(async (req, res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {campground})
}));

app.get("/campgrounds/:id/edit", catchAsync(async (req, res)=>{
    const campground = await Campground.findById(req.params.id);
    console.log(campground)
    res.render('campgrounds/edit', {campground})
}));

app.put("/campgrounds/:id",validateCampground, catchAsync(async(req, res)=>{
    const campground =  await Campground.findByIdAndUpdate(req.params.id,req.body.campgrounds);
    res.redirect(`/campgrounds/${req.params.id}`)
}));

app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
  const campground = await Campground.findByIdAndDelete(
    req.params.id
  );
  res.redirect(`/campgrounds`);
}));

app.all('*', (req, res, next)=>{
  next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next)=>{
   const {status = 500, message="something went wrong"} = err;
  res.status(status).render('error', {status, message, err})
})

app.listen(PORT, ()=>{
    console.log(`SERVER IS UP AND RUNNING ON PORT ${PORT}`)
})