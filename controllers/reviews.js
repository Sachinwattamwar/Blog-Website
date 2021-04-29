const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async(req , res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    review.save();
    campground.save();
    req.flash('success' , 'Successfully posted a review');
    res.redirect(`/blogs/${campground._id}`);
}

module.exports.deleteReview = async(req , res)=>{
    const {id , reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success' , 'Successfully deleted the review');
    res.redirect(`/blogs/${id}`);
}