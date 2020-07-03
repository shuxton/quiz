var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  cookieParser = require("cookie-parser"),
  LocalStrategy = require("passport-local"),
  flash = require("connect-flash"),
  quiz = require("./models/quiz"),
  User = require("./models/user"),
  session = require("express-session"),
  methodOverride = require("method-override");

//requiring routes
var
  quizRoutes = require("./routes/quiz"),
  indexRoutes = require("./routes/index");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(
process.env.db_key 
);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//app.use(express.static(__dirname + "/public"));
app.use('/public', express.static('public'));
app.use(methodOverride("_method"));
app.use(cookieParser("secret"));

// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "I dont like space!",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", indexRoutes);
app.use("/quiz", quizRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log("shuxton's server has started!");
});

