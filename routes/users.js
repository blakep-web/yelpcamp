const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");

router.get("/register", (req, res) => {
    res.render("users/register");
})

router.post("/register", catchAsync(async (req, res) => {
    try {
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) return next();
        req.flash("success", "Welcome to YelpCamp");
        res.redirect("/campgrounds");
    })
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("register");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login");
})

router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), (req, res) => {
    req.flash("success", "Welcome back");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get("/logout", (req, res) => {
    if(!res.locals.currentUser) {
        req.flash("error", "You must be logged in to log out");
        return res.redirect("/login");
    }
    req.logout();
    req.flash("success", "Successfully Logged out");
    res.redirect("/campgrounds");

})

module.exports = router;