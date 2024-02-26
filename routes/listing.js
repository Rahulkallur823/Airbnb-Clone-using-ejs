const express = require('express');
const router = express.Router();

const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');

const { listingSchema, reviewSchema } = require('../schema.js');
const {isLoggedIn,isOwner,validateListing}= require("../middleware.js")

const Review = require("../models/review.js")
const ListingController=require("../controller/listing.js")

const multer = require('multer');
const {storage}=require("../cloudConfig.js")

const upload =multer({storage})

// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//         let errmsg = error.details.map((el) => el.message).join(',');
//         throw new ExpressError(400, errmsg);
//     } else {
//         next();
//     }
// };


router.route('/').get( wrapAsync(ListingController.index))

// (req,res)=>{
//     res.send(req.file)
// })


.post(isLoggedIn,upload.single('listing[image]'), validateListing, wrapAsync(ListingController.createListing));

router.get('/new', isLoggedIn,ListingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(ListingController.ShowListing))


.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(ListingController.updateListing ))

.delete(isLoggedIn,isOwner,wrapAsync(ListingController.destroyListing));

router.get('/:id/edit', isLoggedIn,isOwner,wrapAsync(ListingController.renderEditForm))










module.exports = router;
