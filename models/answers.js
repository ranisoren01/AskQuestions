const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  answer: {
    type: String,
    required: true,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  votes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        // ref: "User",
      },
      value: Number,
    },
  ],
  upvotes: Number,
});

module.exports = mongoose.model("Answer", AnswerSchema);
