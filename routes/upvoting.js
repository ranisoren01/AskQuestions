const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const queswer = require("../models/answers");
const Question = require("../models/question");
const {
  validateAnswer,
  validateQuestion,
  isLoggedIn,
  isAnswerAuthor,
} = require("../middleware");

router.get(
  "/answers/:a_id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const ans = await Answer.findById(req.params.a_id);
    ans.upvotes = ans.upvotes + 1;
    ans.save();
    res.send(`/questions/${req.params.id}`);
  })
);
router.get(
  "/",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const ques = await Question.findById(req.params.id);
    ques.upvotes = ques.upvotes + 1;
    ques.save();
    res.send(`/questions/${req.params.id}`);
  })
);

module.exports = router;
