const Joi = require('joi');


module.exports.campgroundSchema = Joi.object({
    campground : Joi.object({
        title : Joi.string().required(),
        category : Joi.string().required(),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

