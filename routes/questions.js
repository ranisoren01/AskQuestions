const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const Answer = require("../models/answers");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { questionSchema, answerSchema } = require("../schemas");
const {
  validateAnswer,
  validateQuestion,
  isLoggedIn,
} = require("../middleware");

router.get("/new", isLoggedIn, (req, res) => {
  res.render("questions/home");
});
router.get(
  "/",
  catchAsync(async (req, res) => {
    const questions = await Question.find();
    res.render("questions/list", { questions });
  })
);
router.post("/", isLoggedIn, validateQuestion, async (req, res) => {
  const ques = new Question(req.body);
  //console.log(req.body.question);
  await ques.save();
  req.flash("success", "Question has been posted successfully");
  res.redirect("/questions");
});
router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const ques = await Question.findById(req.params.id);
    if (!ques) {
      req.flash("error", "Question not found");
      res.redirect("/questions");
    }
    res.render("questions/edit", { ques });
  })
);
router.put(
  "/:id/edit",
  isLoggedIn,
  validateQuestion,
  catchAsync(async (req, res) => {
    // console.log(req.body);
    const ques = await Question.findByIdAndUpdate(req.params.id, req.body);
    if (!ques) {
      req.flash("error", "Question not found");
      res.redirect("/questions");
    }
    req.flash("success", "Modified the question successfully");
    res.redirect("/questions");
  })
);

router.delete(
  "/:id/delete",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const ques = await Question.findById(req.params.id).populate("answers");
    if (!ques) {
      req.flash("error", "Question not found");
      res.redirect("/questions");
    }
    for (q of ques.answers) {
      console.log(q._id);
      await Answer.findByIdAndDelete(q._id);
    }
    await Question.findByIdAndDelete(req.params.id);
    req.flash("success", "Question has been deleted successfully");
    res.redirect("/questions");
  })
);

module.exports = router;
