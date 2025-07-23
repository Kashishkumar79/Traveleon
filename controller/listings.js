const Listing = require("../models/listing.js");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
}

module.exports.showListings= async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).
    populate(
        {path:"reviews",
        populate:{
            path:"author"
        }
    }).populate("owner");
    
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings"); 
    }

    res.render("listings/show.ejs", { listing });
}

module.exports.createListing=async (req, res,next) => {
    let url = req.file.path;
    let filename=req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image={url,filename}

        await newListing.save();
        req.flash("success","New listing created");
        res.redirect("/listings");
}

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
       if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings"); 
    }
     let orginalImageUrl=listing.image.url;
    orginalImageUrl= orginalImageUrl.replace("/upload","/upload/h_300,w_250")
res.render("listings/edit", { listing ,orginalImageUrl});
}

module.exports.updateListing= async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing");
    }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename=req.file.filename;
    listing.image ={url,filename};
     await listing.save();
    }
    req.flash("success","listing updated!");
    res.redirect(`/listings/${id}`);

}


module.exports.deleteListing=async (req, res) => {
    let { id ,reviewId} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
};