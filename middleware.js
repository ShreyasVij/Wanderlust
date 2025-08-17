const Listing= require("./models/listing.js")
const {listingSchema}=require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema}=require("./schema.js");
const Review = require("./models/review.js");
module.exports.isLoggedIn = (req,res,next)=>{
        if(!req.isAuthenticated()){
/*This is done to store where the loggout user wants to go so that after loggin he can directly
go there without redirecting to listing.
When do this it should work but it doesnt bcz the middleware of passport resets the session
therefore req.session is undefined 
to go around this we use local which cannot be accessed by passport*/
            req.session.redirectUrl=req.originalUrl;

        req.flash("error","You must login first");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl= (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);

    }
    else{
        next();
    }
};

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);

    }
    else{
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id,reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
