const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const User = require("./models/user");
const Pun = require("./models/puns");


//requiring routes
const punRoutes = require("./routes/puns");
const indexRoutes = require("./routes/index");
const ratingRoutes = require("./routes/rating");

mongoose.connect('mongodb://localhost:27017/punsapp', { useNewUrlParser: true });


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Passport configuration
app.use(require("express-session")({
    secret: "random secret text",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/puns", punRoutes);
app.use("/puns", ratingRoutes);


app.listen("3000", () => {
    console.log("The Server Has Started!");
});