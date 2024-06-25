const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const {
    renderSignupForm,
    signup,
    renderLoginForm,
    login,
    logout
} = require("../controllers/users");

router.route("/signup")
    .get(renderSignupForm)
    .post(signup);

router.route("/login")
    .get(renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        login
    );

router.get("/logout", logout);

module.exports = router;
