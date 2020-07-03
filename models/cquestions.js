var mongoose = require("mongoose");

var cquestionsSchema = new mongoose.Schema({
  question: String,
  op1: String,
  op2: String,
  op3: String,
  op4: String,
  answer1: String,
  answe2:String,
  answer3:String,
  placeholder:String,
  img:Number
});



module.exports = mongoose.model("Cquestions", cquestionsSchema);
