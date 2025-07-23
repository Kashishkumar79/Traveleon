const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const flash = require("connect-flash");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

const multer  = require('multer');
const{storage}=require("../cloudConfig.js");
const upload = multer({ storage });


const listingController =require("../controller/listings.js");

router
.route("/")
.get( wrapAsync(listingController.index))
.post (isLoggedIn ,upload.single('listing[image]'),wrapAsync(listingController.createListing));


router.get("/new",isLoggedIn ,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(isLoggedIn,validateListing,upload.single('listing[image]'),wrapAsync(listingController.updateListing))
.delete(isLoggedIn ,wrapAsync(listingController.deleteListing));

//create route


//edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;