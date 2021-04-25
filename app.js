const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const { findById } = require('./models/campground');

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

app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/' , (Req , res)=>{
    res.render('home');
});

app.get('/blogs', async(req , res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index' , {campgrounds});
})

app.get('/blogs/:id', async(req , res)=>{
    const {id} = req.params;
    const blog = await Campground.findById(id);
    res.render('campgrounds/show', {blog});
})

app.listen(3000 , ()=>{
    console.log('port working');
})