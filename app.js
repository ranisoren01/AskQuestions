const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const Question = require("./models/question");
const Answer = require("./models/answers");
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const {questionSchema, answerSchema} = require("./schemas");

mongoose.connect("mongodb://localhost:27017/project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected!!!");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validate = schema =>{
  return (req,res,next) => {
    const {error} = schema.validate(req.body);
    if(error){
      const msg = error.details.map( e => e.message).join(',');
    console.log("message = ",msg);
    throw new ExpressError(msg, 400);
    }
    else next();
  }
}
const validateQuestion = (req,res,next) => {
  const {error} = questionSchema.validate(req.body);
  if(error){
    const msg = error.details.map( e => e.message).join(',');
  throw new ExpressError(msg, 400);
  }
  else next();
}
const validateAnswer = (req,res,next) => {
  const {error} = answerSchema.validate(req.body);
  if(error){
    const msg = error.details.map( e => e.message).join(',');
  throw new ExpressError(msg, 400);
  }
  else next();
}
app.get("/", (req, res) => {
  //res.send('home');
  res.render("questions/home");
});
//questions routes...
app.get("/questions", catchAsync(async (req, res) => {
  const questions = await Question.find();
  res.render("questions/list", { questions });
}));
app.post("/questions",validateQuestion, async (req, res) => {
  const ques = new Question(req.body);
  //console.log(req.body.question);
  await ques.save();
  res.redirect("/questions");
});
app.get("/questions/:id/edit", catchAsync(async (req, res) => {
  const ques = await Question.findById(req.params.id);
  res.render("questions/edit", { ques });
}));
app.put("/questions/:id/edit",validateQuestion,catchAsync(async (req, res) => {
  // console.log(req.body);
  const ques = await Question.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/questions");
}));

app.delete("/questions/:id/delete", catchAsync(async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.redirect("/questions");
}));
///answer routes

app.get("/questions/:id/answers", catchAsync(async (req, res) => {
  const values = await Question.findById(req.params.id).populate("answers");
  res.render("answers/list", { values });
}));

app.get("/questions/:id/new", catchAsync(async (req, res) => {
  const ques = await Question.findById(req.params.id);
  res.render("answers/new", { ques });
}));

app.post("/questions/:id/answers",validateAnswer, catchAsync(async (req, res) => {
  const ques = await Question.findById(req.params.id);
  const ans = new Answer({
    question: ques._id,
    answer: req.body.answer,
  });
  console.log(ans);
  ques.answers.push(ans._id);
  await ans.save();
  await ques.save();
  console.log("aaa");
  console.log(ques);
  res.redirect(`/questions/${req.params.id}/answers`);
}));

app.delete("/questions/:id/answers/:a_id", catchAsync(async (req, res) => {
  const { id, a_id } = req.params;
  await Question.findByIdAndUpdate(id, {
    $pull: {
      answers: a_id,
    },
  });
  await Answer.findByIdAndDelete(a_id);
  res.redirect(`/questions/${id}/answers`);
}));

app.put("/questions/:id/answers/:a_id", catchAsync(async (req, res) => {
  const { id, a_id } = req.params;
  const ans = await Answer.findByIdAndUpdate(req.params.a_id, req.body);
  // res.send(req.body);
  res.redirect(`/questions/${id}/answers`);
}));

app.get("/questions/:id/answers/:a_id/edit",validateAnswer, catchAsync(async (req, res) => {
  const ans = await Answer.findById(req.params.a_id).populate("question");
  res.render("answers/edit", { ans });
}));

app.all("*",(req,res,next)=>{
  next(new ExpressError("Page Not Found",404));
})

app.use((err,req,res,next)=>{
  console.log("inside error handling middleware!!!!!!!\n")
  if(!err.message) 
    err.message = "Something went wrong";
  if(!err.statusCode)
    err.statusCode = 500;
  //console.log(err.statusCode);
  res.status(err.statusCode).render('error',{err});
})

app.listen(3000, () => {
  console.log("From port 3000");
});
