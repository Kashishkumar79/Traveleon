const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
}


module.exports.signup=async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const userRegistered = await User.register(newUser, password);
        req.login(userRegistered, (err) => {
            if (err) {
                return next(err);
            }
         req.flash("success", "Welcome to Traveleon!");
        res.redirect("/listings");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }

}

module.exports.renderLoginForm =(req, res) => {
    res.render("users/login")
}

module.exports.login = async(req,res)=>{
        req.flash("success","Welcome to Traveleon!");
        let redirectUrl= res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
}

 module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "successfully logout!");
        res.redirect("/listings");
    })
}