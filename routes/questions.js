const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { questionSchema, answerSchema } = require("../schemas");

const validateQuestion = (req, res, next) => {
  const { error } = questionSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const questions = await Question.find();
    res.render("questions/list", { questions });
  })
);
router.post("/", validateQuestion, async (req, res) => {
  const ques = new Question(req.body);
  //console.log(req.body.question);
  await ques.save();
  req.flash("success", "Question has been posted successfully");
  res.redirect("/questions");
});
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const ques = await Question.findById(req.params.id);
    if (!ques) req.flash("error", "Question not found");
    res.render("questions/edit", { ques });
  })
);
router.put(
  "/:id/edit",
  validateQuestion,
  catchAsync(async (req, res) => {
    // console.log(req.body);
    const ques = await Question.findByIdAndUpdate(req.params.id, req.body);
    req.flash("success", "Modified the question successfully");
    res.redirect("/questions");
  })
);

router.delete(
  "/:id/delete",
  catchAsync(async (req, res) => {
    await Question.findByIdAndDelete(req.params.id);
    req.flash("success", "Question has been deleted successfully");
    res.redirect("/questions");
  })
);

module.exports = router;
