const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js")
const {isLoggedIn} = require("../middleware.js");
const {isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const {storage}= require("../cloudConfig.js")
const multer  = require('multer')
const upload = multer({ storage })

router
    .route("/")
    .get(wrapAsync(listingController.index))//New route
    .post(//Create route
         isLoggedIn,
        upload.single('listing[image]'),
         validateListing,
        wrapAsync(listingController.createListing));

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);


router
    .route("/:id")
    .get(listingController.showListing)//Show route
    .put(//Update route
    isLoggedIn,
    isOwner,
     upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));//Delete Route

//Edit route
router.get("/:id/edit",isLoggedIn,
    isOwner,wrapAsync(listingController.editForm));

module.exports= router;
