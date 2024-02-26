const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Listing = require("../models/listing.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js")

const {isLoggedIn,isOwner,validate}= require("../middleware.js")


const reviewController=require("../controller/reviews.js")





const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

router.post(
  "/",
  isLoggedIn,
  validateReview,
  
  wrapAsync(reviewController.createReview)
);



router.post('/:id/reviews', validateReview, wrapAsync(async (req, res, next) => {
  let listing = await Listing.findById(req.params.id);
  
  if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
  }

  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "Review added successfully");
  res.redirect(`/listings/${listing._id}`);
}));



router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;


