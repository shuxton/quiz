var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Host = require("../models/admin")
var nodemailer = require("nodemailer");
const xoauth2 = require('xoauth2');

var title, tag, start, end,url,st,et;
//root route

var smtpTransport = nodemailer.createTransport("SMTP",{
  service: process.env.service,
  auth: {
      user:process.env.mail,
      pass:process.env.pass
  }
});

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
  var newUser = new User({ username: req.body.email, qno: 0, score: 0,imgCount:0,ver:false,email:req.body.username,});
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.redirect("/userexists");
    }
   
      console.log("yo")
      var token =""
       User.find({username:req.body.email}).exec(function(err,found){
         if (err)console.log(err)
         else{
token=found[0]._id
var link = "http://"+req.get('host') + "/verify?id=" + token;
mailOptions={
  to : req.body.email,
  subject : "Please confirm your Email account",
  html : "Hello fellow quizzers,<br> It’s an honour to have you aboard,<br>Hop on and take this journey through all the quizzes we got to offer!<br><a href="+link+">Click on the link to verify your email</a><br><br>Have fun,<br>Vinimaya" 
}





console.log(mailOptions);
smtpTransport.sendMail(mailOptions, function(error, response){
if(error){
      console.log(error);
  res.end("error");
}else{
      console.log("Message sent: " + response.message);
  res.end("sent");
   }
  })}
  res.redirect("/email_verification")
      })
     
      
    });
   
  });



router.get("/verify",function(req,res){
  User.updateOne(
    {_id:req.query.id},{ $set:{ver: true }}, function (err, res) {
if(err)
      console.log(err);
    }
  )
  res.render("register_ver",{mail:true})
})

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
// router.post(
//   "/login",
//   passport.authenticate("local", {

//     successRedirect: "/quiz?id="+req.body.username,
//     failureRedirect: "/verification_failed",
//   })
// );

router.post( "/login",function(req,res){
 
  passport.authenticate("local",{failureRedirect: "/verification_failed"})(req, res, function () {
  
    User.find({username:req.body.username}).exec(function(err,found){
      if (err)console.log(err)
      else if(found[0].ver){
       
        res.redirect("/quiz?id="+found[0]._id)
      }
      else  res.redirect("/verification_failed")
      })
  })

  
  });


  router.get("/verification_failed",function(req,res){
    res.render("login_ver")
  })

  router.get("/email_verification",function(req,res){
    res.render("register_ver",{mail:false})
  })

  router.get("/userexists",function(req,res){
    res.render("userexists",{home:false})
  })


// logout route
router.get("/logout", function (req, res) {
  req.logout();

  res.redirect("/quiz");
});

module.exports = router;
