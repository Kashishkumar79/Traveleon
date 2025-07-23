const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError= require("./utils/ExpressError.js");
const{listingSchema}= require("./schema.js");
const{reviewSchema}= require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
    req.session.redirectUrl = req.originalUrl;
     if(!req.isAuthenticated()){
        req.flash("error","you must be logged in to create listings!");
       return  res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if( req.session.redirectUrl ){
        res.locals.redirectUrl = req.session.redirectUrl ;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    let currUser = res.locals.currUser; // ✔️ Correct way to access the logged-in user

    if (!currUser || !listing.owner._id.equals(currUser._id)) {
        req.flash("error", "You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
}


module.exports.validateListing =(req,res,next)=>{
  let result= listingSchema.validate(req.body);
   console.log(result);

if (result.error) {
  let errorMsg = result.error.details.map((el) => el.message).join(",");
  throw new ExpressError(400, errorMsg);
  }else{
    next();
  }
}

module.exports.validateReview =(req,res,next)=>{
  let result= reviewSchema.validate(req.body);
   console.log(result);

if (result.error) {
  let errorMsg = result.error.details.map((el) => el.message).join(",");
  throw new ExpressError(400, errorMsg);
  }else{
    next();
  }
}


module.exports.isReviewAuthor=async(req,res,next)=>{
  let {id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of the review");
       return res.redirect(`/listings/${id}`);
    }
    next();
}