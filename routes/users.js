const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register',(req,res)=>{
    res.render('users/register');
})

router.post('/register',catchAsync(async(req , res , next)=>{
    try{
    const {email , username , password} = req.body;
    const user = new User({email , username});
    const registeredUser =  await User.register(user , password);    
    req.flash('success','Welcome to blog');
    res.redirect('/blogs');
    } catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
}));

router.get('/login',(req,res)=>{
    res.render('users/login');
})

module.exports = router;