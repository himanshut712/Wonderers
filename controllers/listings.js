const Listing = require("../models/listing.js");

module.exports.index = async (req, res, next) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        console.error(err);
        req.flash("error", "Error fetching listings");
        res.redirect("/listings");
    }
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.searchListings = async (req, res, next) => {
    try {
        const { query } = req.query;
        const searchQuery = new RegExp(query, 'i'); 
        const listings = await Listing.find({
            $or: [
                { title: searchQuery },
                { location: searchQuery },
                { country: searchQuery }
            ]
        });
        res.render('listings/index.ejs', { allListings: listings });
    } catch (err) {
        console.error(err);
        req.flash("error", "Error searching listings");
        res.redirect("/listings");
    }
};

module.exports.showListing = async (req, res, next) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist");
            return res.redirect("/listings");
        }
        res.render("listings/show.ejs", { listing });
    } catch (err) {
        console.error(err);
        req.flash("error", "Error fetching listing details");
        res.redirect("/listings");
    }
};

module.exports.createListing = async (req, res, next) => {
    try {
        console.log(req.file); 

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
    } catch (err) {
        console.error(err);
        req.flash("error", "Error creating new listing");
        res.redirect("/listings");
    }
};

module.exports.renderEditForm = async (req, res, next) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist");
            return res.redirect("/listings");
        }
        let originalImageUrl = listing.image.url;
        originalImageUrl.replace("/upload/h_300,w_250");
        res.render("listings/edit.ejs", { listing, originalImageUrl });
    } catch (err) {
        console.error(err);
        req.flash("error", "Error rendering edit form");
        res.redirect("/listings");
    }
};

module.exports.updateListing = async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        if (typeof req.file !== "undefined") {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url, filename };
            await listing.save();
        }
        req.flash("success", "Listing Updated");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Error updating listing");
        res.redirect("/listings");
    }
};

module.exports.deleteListing = async (req, res, next) => {
    try {
        let { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted");
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        req.flash("error", "Error deleting listing");
        res.redirect("/listings");
    }
};

module.exports.filterByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        const listings = await Listing.find({ category });
        res.render('listings/index.ejs', { allListings: listings });
    } catch (err) {
        console.error(err);
        req.flash("error", "Error filtering by category");
        res.redirect("/listings");
    }
};
