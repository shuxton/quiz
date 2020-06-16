var express = require("express");
var router = express.Router();
var Questions = require("../models/quiz");
var Cquestions = require("../models/cquestions");
var middleware = require("../middleware");
var User = require("../models/user");
var Host = require("../models/admin");
var Authen= require("../models/auth");
const { render } = require("ejs");


var a = -1, x = 0,cx=0, imgCount = 0,key=false,mcq=0,con=0;





router.get("/admin",function(req,res){
  res.render("quiz/adminauth")
})



router.post("/adminlogin",function(req,res){
  var u=req.body.username
  var p=req.body.password
  Authen.find({}).exec(function(err,found){
    console.log(found)
    if(err)console.log(err)
    else if(found.length!=0){
     
      if(u==found[0].username && p==found[0].password){
        console.log(u)
        console.log(found[0].username)
        res.render("quiz/admin",{key})
      }
      else res.render("quiz/adminauth")
    }
    else res.render("quiz/adminauth")
  }) 
 
  
})



router.post("/host",function(req,res){
  Host.find({title:req.body.title}).exec(function(err,tit){
    if(tit.length==0){
      Host.insertMany({title:req.body.title,tag:req.body.tag,mcq:req.body.mcq,con:req.body.con,start:req.body.start,end:req.body.end},function(err){
        if(err)console.log(err)
       else{
          key=true
       
       }
      })
     
    }
    else key=true
  })

res.render("quiz/admin",{key})
})



router.post("addQ",function(req,res){
  Questions.insertMany({question:req.body.question,op1:req.body.op1,op2:req.body.op2,op3:req.body.op3,op4:req.body.op4,answer:req.body.answer})
})



router.post("addC",function(req,res){
  Cquestions.insertMany({question:req.body.question,op1:req.body.op1,op2:req.body.op2,op3:req.body.op3,op4:req.body.op4,answer:req.body.answer})
})



router.get("/", middleware.isLoggedIn, function (req, res) {
  if (a == -1) {
    Host.find(
      {}
    ).exec(function (err, found) {
      mcq = parseInt(found[0].mcq);
      con=parseInt(found[0].con);
      console.log(mcq)
      console.log(con)
      if(mcq-10>0)
      x = Math.floor(Math.random() * (mcq-10));
      else x=0
      if(con-10>0)
      cx = Math.floor(Math.random() * (con-10));
      else cx=0
    })
   
    a = 0;
  }
  Questions.find({}, function (err, allQuestions) {
    if (err) {
      console.log(err);
    } else {
      Cquestions.find({}, function (err, allCquestions) {
        if (err) {
          console.log(err);
        } else {
          Host.find({},function(err,found){
            if (err) {
              console.log(err);
            } else {
              res.render("quiz/index", { questions: allQuestions,cquestions:allCquestions,start:found[0].start,end:found[0].end ,x,cx, a, imgCount });
            }
          })
     
    }
  })
  }});

});




router.get("/leaderboard", function (req, res) {

  User.find({}).sort({ score: -1 }).exec(function (err, allUsers) {
    if (err) {
      console.log(err);
    } else {
      var title;
      Host.find({}).exec(function(err,found){
        title=found[0].title;
       
      res.render("quiz/leaderboard", { user: allUsers,title,start:found[0].start,end:found[0].end });
    }) }
  });
});




router.post("/img/:id/:uid/:qno", middleware.isLoggedIn, function (req, res) {
  imgCount++;
  if (imgCount <= 3) {
    var myquery = { _id: req.params.uid };
    var sc,y;

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


router.post("/ans/:id/:uid/:qno", middleware.isLoggedIn, function (req, res) {
  a = a + 1;
  imgCount=0;
  if (a == 15) a = -1;
console.log(a)
  var myquery = { _id: req.params.uid };
  var sc,y;

Cquestions.find({_id:req.params.id}).exec(function(err,found){
  var ans=found[0].answer
  
  if(ans.toUpperCase()===req.body.ans.toUpperCase()){
    User.find(
      myquery
    ).exec(function (err, found) {
      sc = parseInt(found[0].score);
      y = parseInt(found[0].qno) + 1;
      if (y > 14) y = 14;
      var newvalues = {
        $set: {
          score: sc + 10,
          qno:y

  
        }
      };
      User.updateOne(
        myquery, newvalues, function (err, res) {
  
          console.log(sc);
        }
      )
    })
  
  console.log("bingo")
  }
 else{
  User.find(
    myquery
  ).exec(function (err, found) {
    sc = parseInt(found[0].score);
    y = parseInt(found[0].qno) + 1;
    if (y > 15) y = 15;
    var newvalues = {
      $set: {
        
        qno:y


      }
    };
    User.updateOne(
      myquery, newvalues, function (err, res) {

        console.log(sc);
      }
    )
  })
 }

})

res.redirect("/quiz");
})



router.post("/:id/:uid/:qno", middleware.isLoggedIn, function (req, res) {

  a = a + 1;
  var name = req.body.op;
  var myquery = { _id: req.params.uid };
  var sc,y;
  User.find(
    myquery
  ).exec(function (err, found) {
    sc = parseInt(found[0].score);
    y = parseInt(found[0].qno) + 1;
    if (y > 9) {a=0;y = 10;}
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
