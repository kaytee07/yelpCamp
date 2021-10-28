const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Campground = require('./model/campground.js'); 

const PORT = 8080;

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',()=>{
    console.log('Database connected')
});

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res)=>{
    res.render('home')
})


app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", (req, res) => {
  let campground = Campground.create(req.body.campgrounds);
  res.redirect('/campgrounds')
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
});

app.get('/campgrounds/:id', async (req, res)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', {campground})
})

app.get("/campgrounds/:id/edit", async (req, res)=>{
    const campground = await Campground.findById(req.params.id);
    console.log(campground)
    res.render('campgrounds/edit', {campground})
});

app.put("/campgrounds/:id", async(req, res)=>{
    const campground =  await Campground.findByIdAndUpdate(req.params.id,req.body.campgrounds);
    console.log(campground)
    res.redirect(`/campgrounds/${req.params.id}`)
});

app.delete("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findByIdAndDelete(
    req.params.id
  );
  res.redirect(`/campgrounds`);
});


app.listen(PORT, ()=>{
    console.log(`SERVER IS UP AND RUNNING ON PORT ${PORT}`)
})