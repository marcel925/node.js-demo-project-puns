const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Pun = require("../models/puns");

//root route
router.get("/", function(req, res){
    Pun.find({}).limit(40).exec(function(err, allPuns){
        if (err){
            console.log(err);
            req.flash("error", "There was an error. Sorry!");
            res.redirect("back");
        } else {
            allPuns.sort(function (a, b) {
                return b.totalVotes - a.totalVotes
            });
            res.render("home",{puns:allPuns, currentUser: req.user});
        }
    });
});

//profile route
router.get("/profile/:username", function(req, res){
    var username = req.params.username;
    Pun.find({'author.username': username}, function(err, foundPuns){
        if (err){
            console.log(err);
        } else {
            foundPuns.sort((a, b) => b.totalVotes - a.totalVotes);
            var length = foundPuns.length;
            var upvotesTotal = 0;
            var downvotesTotal = 0;
            for (var i = 0; i < foundPuns.length; i++){
                upvotesTotal += foundPuns[i].upvotes.length;
                downvotesTotal += foundPuns[i].downvotes.length;
            }            
            res.render("profile", {puns:foundPuns, length: length, upvotesTotal: upvotesTotal, downvotesTotal: downvotesTotal});
        }
    });
});

//show register form
router.get("/register", function(req, res){
    res.render('register');
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to NamePuns.net " + user.username);
            res.redirect("/");
        });
    });
})

//show login form
router.get("/login", function(req, res){
    res.render('login');
});

//handle log in logic
router.post("/login", passport.authenticate("local",{
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You are logged out!");
    res.redirect("/");
});

module.exports = router;