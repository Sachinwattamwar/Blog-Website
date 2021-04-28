const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema , reviewSchema} = require('../schemas.js');
const Review = require('../models/review');
const {validateReview , isLoggedIn , isReviewAuthor} = require('../middleware');



router.post('/', isLoggedIn ,validateReview ,catchAsync(async(req , res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    review.save();
    campground.save();
    req.flash('success' , 'Successfully posted a review');
    res.redirect(`/blogs/${campground._id}`);
}));

router.delete('/:reviewId' ,isLoggedIn, isReviewAuthor,catchAsync(async(req , res)=>{
    const {id , reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success' , 'Successfully deleted the review');
    res.redirect(`/blogs/${id}`);
}));

module.exports = router;
