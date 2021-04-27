const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const catchAsync = require('./utils/catchAsync');
const {campgroundSchema , reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const { findById } = require('./models/campground');
const methodOverride = require('method-override');
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/blog-website', {
    useNewUrlParser: true,
    useCreateIndex : true , 
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error" , console.error.bind(console, "connection error"));
db.once("open",()=>{
    console.log("databse connected")
});

const app = express();

app.engine('ejs',ejsMate);
app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));

const validateCampground = (req , res , next)=>{
    const {error} = campgroundSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg , 400);
    }
    else 
    {
        next()
    }
}

const validateReview = (req , res , next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg , 400);
    }
    else 
    {
        next()
    }
}


app.get('/' , (Req , res)=>{
    res.render('home');
});

app.get('/blogs', catchAsync(async(req , res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index' , {campgrounds});
}));

app.get('/blogs/new' , (req , res)=>{
    res.render('campgrounds/new');
});

app.post('/blogs',validateCampground ,catchAsync(async(req , res , next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid blog data' , 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/blogs/${campground._id}`);
}))



app.get('/blogs/:id', catchAsync(async(req , res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', {campground});
}));

app.get('/blogs/:id/edit', catchAsync(async(req , res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
}));

app.put('/blogs/:id',validateCampground,catchAsync(async (req , res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id , {...req.body.campground} );
    res.redirect(`/blogs/${campground._id}`);
}));

app.delete('/blogs/:id', catchAsync(async (req , res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/blogs')
}));

app.post('/blogs/:id/reviews', validateReview ,catchAsync(async(req , res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.save();
    campground.save();
    res.redirect(`/blogs/${campground._id}`);
}))

app.all('*',(req , res , next)=>{
    next(new ExpressError('Page not found',404));
});

app.use((err , req , res , next)=>{
    const {statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no , something went wrong';
    res.status(statusCode).render('error' , {err});
});

app.listen(3000 , ()=>{
    console.log('port working');
});