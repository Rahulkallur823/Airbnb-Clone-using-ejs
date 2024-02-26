const { listingSchema, reviewSchema } = require('./schema.js');
const Listing =require("./models/listing.js")
const review=require("./models/review.js")
const ExpressError=require("./utils/ExpressError.js")


    module.exports.isLoggedIn=(req,res,next)=>{
    // console.log(req)
req.session.redirectUrl=req.orignalUrl;
    if(!req.isAuthenticated()){
        req.flash("error","you must be logged in for this");
        return res.render('users/login.ejs');
    }
    next();
} 

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{



    let { id } = req.params;
    let listing = await Listing.findById(id);


    
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you dont have permission")
       return res.redirect(`/listings/${id}`);
    }
next();

}
    

module.exports.validateListing=(req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};


module.exports.isReviewAuthor=async(req,res,next)=>{
    let { id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author(res.locals.currUser._id)){
        req.flash("error","you dont have permission")
        return res.redirect(`/listings/${id}`)
    }
    next();
}


module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errmsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errmsg);
    } else {
      next();
    }
  };