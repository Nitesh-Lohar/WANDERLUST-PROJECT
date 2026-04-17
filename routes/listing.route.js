const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.model.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listing.controller.js");

// Index and Create Route 
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing),
  );

// New form Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show, Update and Delete Route
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Edit form Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

module.exports = router;
