const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  answer: {
    type: Schema.Types.ObjectId,
    ref: "Answer",
    required: true,
  },
});
module.exports = mongoose.model("Comment", commentsSchema);
