const express = require("express");
const router = express.Router();
const User = require("../models/users");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");

router.get("/register", async (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const regUser = await User.register(user, password);

      // console.log(regUser);
      req.flash("success", "Successfully registered");
      res.redirect("/questions");
    } catch (e) {
      req.flash("error", e.message);
      return res.redirect("/users/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: true,
  }),
  catchAsync(async (req, res) => {
    req.flash("success", "Welcome");
    res.redirect("/questions");
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged out successfully");
  res.redirect("/questions");
});

module.exports = router;
