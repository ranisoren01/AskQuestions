const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
});

module.exports = mongoose.model("Question", QuestionSchema);
