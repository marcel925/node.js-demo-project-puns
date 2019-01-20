const express = require("express");
const router = express.Router({mergeParams: true});
const Pun = require("../models/puns");

//INDEX - show all puns
router.get("/", function(req, res){
    Pun.find({}, function(err, allPuns){
        if (err){
            console.log(err);
            req.flash("error", "There was an error. Sorry!");
            res.redirect("back");
        } else {
            allPuns.sort(function (a, b) {
                return b.totalVotes - a.totalVotes
            });
            res.render("index",{puns:allPuns, currentUser: req.user});
        }
    });
});

//CREATE - add new pun to DB (no duplicate descriptions)
router.post("/", isLoggedin, function(req, res){
    //get data
    var lowerCaseName = req.body.name.toLowerCase().trim();
    var name = lowerCaseName.charAt(0).toUpperCase() + lowerCaseName.slice(1);

    var description = req.body.description.trim();
    var upvotes = [];
    var downvotes = [];
    var totalVotes = 0;
    var author = {
        id: req.user._id,
        username: req.user.username
    }

    var newPun = {name, description, author, upvotes, downvotes, totalVotes}
    
    Pun.find({description}, function(err, foundDesc){
        if (err){
            console.log(err);
        } else {
            if (foundDesc.length > 0){
                req.flash("error", "Pun already exists");
                res.redirect("back");
			} else if (description.length < 10){
				req.flash("error", "The pun is too short...");
                res.redirect("back");
            } else {
                Pun.create(newPun, function(err, newlyCreated){
                    if (err) {
                        req.flash("error", "Failed to add pun. Please try again later.");
                        console.log(err);
                    } else {
                        req.flash("success", "You successfully added a new pun! Very punny!");
                        res.redirect("/puns/name/" + name);
                    }
                });
            }
        }
    })   
});



//NEW - show form to create new pun
router.get("/new", isLoggedin, function(req, res){
    res.render("new");
});

//FILTER DATABASE BY NAMES - filter certain names
router.get("/name/:name", function(req, res){

    var lowerCaseName = req.params.name.toLowerCase();
    var name = lowerCaseName.charAt(0).toUpperCase() + lowerCaseName.slice(1);

    Pun.find({name}, function(err, foundName){
            if (err) {
                req.flash("error", "There was an error. Sorry!");
                res.render("back");
            } else {
                if (!foundName) {
                    res.render("back");
                } else if (foundName.length == 0) {
                    var lowerCaseName = req.params.name.toLowerCase();
                    foundName.name = lowerCaseName.charAt(0).toUpperCase() + lowerCaseName.slice(1);
                    res.render("name_not_found", {puns:foundName});  
                } else {
                    foundName.sort(function (a, b) {
                        return b.totalVotes - a.totalVotes
                    });
                    res.render("name_found", {puns:foundName});
                }
            }
        });
});


//SHOW - shows more info about one pun
router.get("/:id", function(req, res){
    
    Pun.findById(req.params.id, function(err, foundPun){
        if (err) {
            req.flash("error", "There was an error. Sorry!");
            res.redirect("back");
        } else {

            if (!foundPun) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            
            res.render("show", {pun:foundPun});
        }
    });
});


//EDIT - Edit pun route
router.get("/:id/edit", checkPunOwnership, function(req, res){
    Pun.findById(req.params.id, function(err, foundPun){
        res.render("edit", {pun:foundPun});
        });
});

//UPDATE - Updates pun route
router.put("/:id", checkPunOwnership, function(req, res){
    //find and update the correct pun
    var lowerCaseName = req.body.name.toLowerCase().trim();
    var name = lowerCaseName.charAt(0).toUpperCase() + lowerCaseName.slice(1);

    var description = req.body.description.trim();

    Pun.findByIdAndUpdate(req.params.id, {name, description}, function(err, updatedPun){
        if (err) {
            req.flash("error", "You need to be logged in to do that.");
            res.redirect("/puns");
        } else {
            res.redirect("/puns/name/" + name);
        }
    });
});

//DESTROY - Deletes pun route
router.delete("/:id", checkPunOwnership, function(req, res){
    Pun.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "You need to be logged in to do that.");
            res.redirect("/");
        } else {
            req.flash("success", "You deleted the pun.");
            res.redirect("/");
        }
    });
});


//middleware
function isLoggedin(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}

function checkPunOwnership(req, res, next) { 
    if (req.isAuthenticated()){
        Pun.findById(req.params.id, function(err, foundPun){
            if(err){
                console.log(err);
                req.flash("error", "Sorry! Pun not found.");
                res.redirect("back");
            } else {

                if (!foundPun) {
                    req.flash("error", "Pun not found.");
                    return res.redirect("back");
                }

                if (foundPun.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.")
        res.redirect("back");
    }
}

module.exports = router;