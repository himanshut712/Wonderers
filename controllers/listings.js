const Listing = require("../models/listing.js");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }
  module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
    }
    // listings.js controller
    module.exports.searchListings = async (req, res) => {
      const { query } = req.query;
      const searchQuery = new RegExp(query, 'i'); // Case-insensitive search
      const listings = await Listing.find({
        $or: [
          { title: searchQuery },
          { location: searchQuery },
          { country: searchQuery }
        ]
      });
      res.render('listings/index', { allListings: listings });
    };
    
  
  module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}
module.exports.createListing = async (req, res, next) => {
  try {
    console.log(req.file); // Add this line to see what req.file contains

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  } catch (e) {
    next(e);
  }
};

  module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    }
let originalImageUrl=    listing.image.url;
originalImageUrl.replace("/upload/h_300,w_250")
    res.render("listings/edit.ejs", { listing,originalImageUrl });
  }
  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename=req.file.filename;
    listing.image = {url,filename}
    await listing.save()}
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  }
  module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    await Listing.findByIdAndDelete(id, { ...req.body.listing });
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  }
module.exports.filterByCategory = async (req, res) => {
  const { category } = req.params;
  const listings = await Listing.find({ category });
  res.render('listings/index.ejs', { allListings: listings });
};
