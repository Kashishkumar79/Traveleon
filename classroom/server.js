const express = require("express");
const app = express();
const post =require("./routes/post.js");
const user =require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const path =require("path")


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOption ={
    secret:"mysuupersecrestring",
    resave:false,
    saveUninitialized:true,
};

app.use(session(sessionOption));
app.use(flash());

app.use((req,res,next)=>{
     res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    if(name=="anonymous"){
    req.flash("error", "User not register");
    }else{
    req.flash("success", "User register successfull")
    }
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    // res.locals.message=flash("success");
    res.render("page", { name: req.session.name });
});




app.listen(3000, (req, res) => {
    console.log("server is listening to port 3000");
});
