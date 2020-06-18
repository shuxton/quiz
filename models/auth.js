var mongoose = require("mongoose");

var authenSchema = new mongoose.Schema({
    username: String,
    password: String,
    login: Boolean
});


module.exports = mongoose.model("Authen", authenSchema);