const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const Question = require("./models/question");
const Answer = require("./models/answers");
const methodOverride = require("method-override");

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

app.get("/", (req, res) => {
  //res.send('home');
  res.render("questions/home");
});
//questions routes...
app.get("/questions", async (req, res) => {
  const ques = await Question.find();
  res.render("questions/list", { ques });
});
app.post("/questions", async (req, res) => {
  const ques = new Question(req.body);
  await ques.save();
  res.redirect("/questions");
});
app.get("/questions/:id/edit", async (req, res) => {
  const ques = await Question.findById(req.params.id);
  res.render("questions/edit", { ques });
});
app.put("/questions/:id/edit", async (req, res) => {
  // console.log(req.body);
  const ques = await Question.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/questions");
});

app.delete("/questions/:id/delete", async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.redirect("/questions");
});
///answer routes

app.get("/questions/:id/answers", async (req, res) => {
  const values = await Question.findById(req.params.id).populate("answers");
  res.render("answers/list", { values });
});

app.get("/questions/:id/new", async (req, res) => {
  const ques = await Question.findById(req.params.id);
  res.render("answers/new", { ques });
});

app.post("/questions/:id/answers", async (req, res) => {
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
  res.send(ques.populate("answers"));
  // console.log(ques);
  // res.send(ques.populate("answers"));
});

app.listen(3000, () => {
  console.log("From port 3000");
});
