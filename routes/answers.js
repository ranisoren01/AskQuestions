const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { questionSchema, answerSchema } = require("../schemas");
const Question = require("../models/question");
const Answer = require("../models/answers");

const validateAnswer = (req, res, next) => {
  const { error } = answerSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const values = await Question.findById(req.params.id).populate("answers");
    res.render("answers/list", { values });
  })
);

router.get(
  "/new",
  catchAsync(async (req, res) => {
    const ques = await Question.findById(req.params.id);
    res.render("answers/new", { ques });
  })
);

router.post(
  "/",
  validateAnswer,
  catchAsync(async (req, res) => {
    const ques = await Question.findById(req.params.id);
    if (!ques) req.flash("error", "Question not found");
    const ans = new Answer({
      question: ques._id,
      answer: req.body.answer,
    });
    console.log(ans);
    ques.answers.push(ans._id);
    await ans.save();
    await ques.save();
    // console.log(ques);
    req.flash("success", "Asnwer saved successfully");
    res.redirect(`/questions/${req.params.id}/answers`);
  })
);

router.delete(
  "/:a_id",
  catchAsync(async (req, res) => {
    const { id, a_id } = req.params;
    await Question.findByIdAndUpdate(id, {
      $pull: {
        answers: a_id,
      },
    });
    await Answer.findByIdAndDelete(a_id);
    req.flash("success", "Deleted the answer successfully");
    res.redirect(`/questions/${id}/answers`);
  })
);

router.put(
  "/:a_id",
  catchAsync(async (req, res) => {
    const { id, a_id } = req.params;
    const ans = await Answer.findByIdAndUpdate(req.params.a_id, req.body);
    req.flash("success", "Modified answer successfully");
    // res.send(req.body);
    res.redirect(`/questions/${id}/answers`);
  })
);

router.get(
  "/:a_id/edit",
  catchAsync(async (req, res) => {
    const ans = await Answer.findById(req.params.a_id).populate("question");
    if (!ans) {
      req.flash("error", "Answer not found");
      return res.redirect(`/questions/${req.params.id}/answers`);
    }
    res.render("answers/edit", { ans });
  })
);

module.exports = router;
