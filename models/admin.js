var mongoose = require("mongoose");

var hostSchema = new mongoose.Schema({
  title: String,
  tag: String,
  mcq: Number,
  con: Number,
  key:Boolean,
  start: Date,
  end: Date,
});

module.exports = mongoose.model("Host", hostSchema);