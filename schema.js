const joi = require('joi');
const listing = require('./models/listing');

module.exports.listingSchema=joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required(),
        country:joi.string().required(),

        price:joi.string().required().min(0),

        
        image:joi.string().allow("",null),
        


    }).required()
})


module.exports.reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().required(),
        comment:joi.string().required()

}).required(),
})