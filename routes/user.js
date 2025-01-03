const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js")

const userController = require("../controllers/user.js")

router.get("/signup", (req, res) => {
    res.render("user/signup")
});

router.post("/signup", wrapAsync(userController.signupUser));

router.get("/login", (req, res) => {
    res.render("user/login.ejs")
});

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),
    userController.loginUser
);

router.get("/logout", userController.logoutUser);

module.exports = router;