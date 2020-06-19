var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Host = require("../models/admin")
var title, tag, start, end,url,st,et;
//root route

router.get("/", function (req, res) {
  Host.find({}).exec(function (err, found) {
    title = found[0].title;
    tag = found[0].tag;
    start = found[0].start;
    end = found[0].end
    url=found[0].url
    st=found[0].st
et=found[0].et
  })
  res.render("landing", { st,et,title, tag, start, end,url });
});

// show register form
router.get("/register", function (req, res) {
  Host.find({}).exec(function (err, found) {
    title = found[0].title;
    start = found[0].start;
    end = found[0].end
    url=found[0].url
    st=found[0].st
et=found[0].et
  })
  res.render("register", { st,et,title, start, end ,url});
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
  Host.find({}).exec(function (err, found) {
    if(err)console.log(err)
    title = found[0].title;
    start = found[0].start;
    end = found[0].end
    url=found[0].url
    st=found[0].st
et=found[0].et
  })
  res.render("login", { et,st,title, start, end ,url});
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
