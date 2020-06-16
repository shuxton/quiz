var mongoose = require("mongoose");

var authenSchema = new mongoose.Schema({
 username:String,
 password:String,
});


module.exports = mongoose.model("Authen", authenSchema);