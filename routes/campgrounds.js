const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn , isAuthor , validateCampground} = require('../middleware');

const Campground = require('../models/campground');



router.get('/', catchAsync(async(req , res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index' , {campgrounds});
}));

router.get('/new' ,isLoggedIn ,(req , res)=>{
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn,validateCampground ,catchAsync(async(req , res , next)=>{
    
    // if(!req.body.campground) throw new ExpressError('Invalid blog data' , 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success' , 'Successfully posted a blog');
    res.redirect(`/blogs/${campground._id}`);
}))

router.get('/:id',catchAsync(async(req , res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews').populate('author');
    console.log(campground);
    if(!campground)
    {
        req.flash('error' , 'cannot find the blog');
        return res.redirect('/blogs');
    }
    res.render('campgrounds/show', {campground});
}));

router.get('/:id/edit', isLoggedIn,isAuthor ,catchAsync(async(req , res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground)
    {
        req.flash('error' , 'cannot find the blog');
        return res.redirect('/blogs');
    }
    res.render('campgrounds/edit', {campground});
}));

router.put('/:id',isLoggedIn ,isAuthor ,validateCampground,catchAsync(async (req , res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id , {...req.body.campground} );
    req.flash('success' , 'Successfully edited the blog');
    res.redirect(`/blogs/${campground._id}`);
}));

router.delete('/:id', isLoggedIn,isAuthor ,catchAsync(async (req , res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success' , 'Successfully deleted a blog');
    res.redirect('/blogs')
}));


module.exports = router;