const mongoose = require("mongoose");
const { schema } = require("./question");
const Schema = mongoose.Schema;

const Answer = new Schema({
  Answer: {
    type: String,
    required: True,
  },
  question: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: Question,
  },
});
