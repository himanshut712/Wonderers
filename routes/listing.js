const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer")
const {storage} = require("../cloudConfig.js")
const upload =multer({storage})

//new route
router.get("/new", isLoggedIn,listingController.renderNewForm);
//search route
router.get("/search", wrapAsync(listingController.searchListings));

router.route("/")
.get(
  wrapAsync(listingController.index)
)
.post(isLoggedIn,
    upload.single("listing[image]"),  validateListing,
  wrapAsync(listingController.createListing)
);

 router.route("/:id")
 .get(
  wrapAsync(listingController.showListing)
)
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
   validateListing,
  wrapAsync(listingController.updateListing)
)
.delete( 
  isLoggedIn,
  wrapAsync(listingController.deleteListing)
);


//Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);



module.exports = router;
