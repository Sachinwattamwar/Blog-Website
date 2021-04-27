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

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


mongoose.connect('mongodb://localhost:27017/blog-website', {
    useNewUrlParser: true,
    useCreateIndex : true , 
    useUnifiedTopology: true,
    useFindAndModify : false
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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/blogs', campgrounds);
app.use('/blogs/:id/reviews' , reviews);

app.get('/' , (Req , res)=>{
    res.render('home');
});


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