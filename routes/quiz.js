var express = require("express");
var router = express.Router();
var Questions = require("../models/quiz");
var middleware = require("../middleware");
var User = require("../models/user");
var a = -1, x = 0, imgCount = 0;
router.get("/", middleware.isLoggedIn, function (req, res) {
  if (a == -1) {
    x = Math.floor(Math.random() * 20);
    a = 0;
  }
  Questions.find({}, function (err, allQuestions) {
    if (err) {
      console.log(err);
    } else {
      res.render("quiz/index", { questions: allQuestions, x, a, imgCount });
    }
  });

});
router.get("/leaderboard", function (req, res) {

  User.find({}).sort({ score: -1 }).exec(function (err, allUsers) {
    if (err) {
      console.log(err);
    } else {
      res.render("quiz/leaderboard", { user: allUsers });
    }
  });
});


router.post("/img/:id/:uid/:qno", middleware.isLoggedIn, function (req, res) {
  imgCount++;
  if (imgCount <= 3) {
    var myquery = { _id: req.params.uid };
    var sc, y;

    User.find(
      myquery
    ).exec(function (err, found) {
      sc = parseInt(found[0].score);
      var newvalues = {
        $set: {
          score: sc - 1,

        }
      };
      User.updateOne(
        myquery, newvalues, function (err, res) {

          console.log(sc);
        }
      )
    })
  }
  else imgCount = 3;

  res.redirect("/quiz");

})
router.post("/:id/:uid/:qno", middleware.isLoggedIn, function (req, res) {

  a = a + 1;
  if (a == 10) a = -1;
  var name = req.body.op;
  var myquery = { _id: req.params.uid };
  var sc, y;
  // var y = parseInt(req.params.qno) + 1;
  User.find(
    myquery
  ).exec(function (err, found) {
    sc = parseInt(found[0].score);
    y = parseInt(found[0].qno) + 1;
    if (y > 9) y = 10;
    Questions.find({
      _id: req.params.id,
      answer: name,
    }).exec(function (err, f) {
      if (f.length == 0) {

        var newvalues = {
          $set: {
            score: sc - 1,

          }
        };
        User.updateOne(
          myquery, newvalues, function (err, res) {

            console.log(sc);
          }
        )
      } else {

        var newvalues = {
          $set: {
            score: sc + 4,

          }
        };
        User.updateOne(
          myquery, newvalues, function (err, res) {
            console.log(sc);
          }
        )
      }
    });
    var nvalues = {
      $set: {
        qno: y,
      }
    };
    User.updateOne(
      myquery, nvalues, function (err, res) {

        console.log(y);
      }
    )

  })







  res.redirect("/quiz");

});




module.exports = router;
