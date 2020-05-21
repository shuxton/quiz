var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function (req, res) {
  res.render("landing");
});

// show register form
router.get("/register", function (req, res) {
  res.render("register");
});

//handle sign up logic
router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username, qno: 0, score: 0 });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function () {

      res.redirect("/quiz");
    });
  });
});

//show login form
router.get("/login", function (req, res) {
  res.render("login");
});

//handling login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/quiz",
    failureMessage: "Invalid Credentials",
    failureRedirect: "/login",
  })
);

// logout route
router.get("/logout", function (req, res) {
  req.logout();

  res.redirect("/quiz");
});

module.exports = router;
