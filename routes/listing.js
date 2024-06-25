const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listings");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

// Listings index route
router.get("/", listingController.index);

// New listing route
router.get("/new", isLoggedIn, listingController.renderNewForm);
router.post("/", isLoggedIn, validateListing, listingController.createListing);

// Edit listing route
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

// Show listing route
router.get("/:id", listingController.showListing);
router.put("/:id", isLoggedIn, isOwner, validateListing, listingController.updateListing);
router.delete("/:id", isLoggedIn, isOwner, listingController.deleteListing);

// Search listings route
router.get("/search", isLoggedIn, listingController.searchListings);

// Filter by category route
router.get('/category/:category', isLoggedIn, listingController.filterByCategory);

module.exports = router;
