var mongoose = require("mongoose");
const { Double, Decimal128 } = require("mongodb");

var hostSchema = new mongoose.Schema({
  title: String,
  tag: String,
  mcq: Number,
  con: Number,
  key:Boolean,
  start: Date,
  end: Date,
  url: String,
  st:Decimal128,
  et:Decimal128,
});

module.exports = mongoose.model("Host", hostSchema);