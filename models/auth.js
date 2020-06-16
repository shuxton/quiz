var mongoose = require("mongoose");

var authSchema = new mongoose.Schema({
 username:String,
 password:String,
});

module.exports = mongoose.model("Auth", authSchema);