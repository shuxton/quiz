var mongoose = require("mongoose");

var cquestionsSchema = new mongoose.Schema({
  question: String,
  op1: String,
  op2: String,
  op3: String,
  op4: String,
  answer: String,
});



module.exports = mongoose.model("Cquestions", cquestionsSchema);
