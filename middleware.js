const questionSchema = require("./models/question");
const answerSchema = require("./models/answers");
const ExpressError = require("./utils/ExpressError");

module.exports.validateQuestion = (req, res, next) => {
  const { error } = questionSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};
module.exports.validateAnswer = (req, res, next) => {
  const { error } = answerSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};

module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please login to continue");
  res.redirect("/users/login");
};
