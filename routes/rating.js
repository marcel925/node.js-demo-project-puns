const express = require("express");
const router = express.Router({mergeParams: true});
const Pun = require("../models/puns");

//UPVOTE ROUTE - add username to upvote array
router.post("/:id/upvote", isLoggedin, (req, res) => {
    
    var username = req.user.username;
    
    Pun.findById(req.params.id, function(err, foundPun){
        if (err) {
            console.log(err);
            req.flash("error", "There was an error. Sorry!");
            res.render("back");
        } else {  
            if (foundPun.upvotes.includes(username)) {
                var index = foundPun.upvotes.indexOf(req.body.user_id);
                foundPun.upvotes.splice(index, 1);
            } else {
                foundPun.upvotes.push(username);
            }

            foundPun.totalVotes = foundPun.upvotes.length - foundPun.downvotes.length;
            foundPun.save();
        }
    });

    res.redirect("back");
});

//DOWNVOTE ROUTE - add username to downvote array
router.post("/:id/downvote", isLoggedin, (req, res) => {
    
    var username = req.user.username;
    
    Pun.findById(req.params.id, function(err, foundPun){
        if (err) {
            console.log(err);
            req.flash("error", "There was an error. Sorry!");
            res.render("back");
        } else {  
            if (foundPun.downvotes.includes(username)) {
                var index = foundPun.downvotes.indexOf(req.body.user_id);
                foundPun.downvotes.splice(index, 1);
            } else {
                foundPun.downvotes.push(username);
            }
            foundPun.totalVotes = foundPun.upvotes.length - foundPun.downvotes.length;
            foundPun.save();
        }
    });

    res.redirect("back");
});


function isLoggedin(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}


module.exports = router;