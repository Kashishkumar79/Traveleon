if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
console.log(process.env.HELLO);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError= require("./utils/ExpressError.js");
const passport=require("passport");
const localStrategy=require("passport-local");
const User = require("./models/user.js");




const listingRouter= require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");


const port =3000;

main().then(() => {
    console.log("server was connected");
}).catch((err) => {
    console.log("connection failed");
});

async function main() {
    mongoose.connect('mongodb://127.0.0.1:27017/traveleon');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const sessionOptions ={
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }

};
app.get("/", (req, res) => {
    res.send("server was working");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;

    next();
})


app.use("/listings" ,listingRouter);
app.use("/listings/:id/reviews" ,reviewRouter);
app.use("/" ,userRouter); 




app.use((req, res, next) => {
  res.status(404).render("error", { message: "Page Not Found" });
});

//  3. Catch errors thrown via `next(err)`
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("error", { message });
});

app.listen(port, (req, res) => {
    console.log("server is listening to port 3000");
});