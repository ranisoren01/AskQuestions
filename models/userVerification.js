const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserVerification", LinkSchema);
