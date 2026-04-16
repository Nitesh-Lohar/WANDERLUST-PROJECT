const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { reviewSchema } = require("../joiSchema.js");

const Review = require("../models/review.model.js");
const Listing = require("../models/listing.model.js");



// Validation Review Middleware
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  console.log(error);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

// Post review
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review recorded!")
    res.redirect(`/listings/a/${listing._id}`);
  }),
);

// Delete review
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!")
    res.redirect(`/listings/a/${id}`);
  }),
);

module.exports = router;
