const Review = require("../models/review.js")
const Listing = require("../models/listing.js")
module.exports.createReview= async(req,res)=>{
   let listing= await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();
   req.flash("success","New Review Created!");

    res.redirect(`/listings/${listing._id}`);

}

module.exports.destroyReview = async (req, res) => {
       let{ id, reviewId}=req.params;
       //WE have to delelte from the array that we had written in the schema
//To that we use $pull operator of mongos
//It pulls the value(dlt) from the array 
//reviews array ke andhar wala reviewID and remove that 
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
     await Review.findByIdAndDelete(reviewId);
     req.flash("success","Review Deleted");
     res.redirect(`/listings/${id}`);
    }