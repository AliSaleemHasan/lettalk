const user_Router = require("express").Router();
const bodyParser = require("body-parser");
const User = require("../models/users");
user_Router.use(bodyParser.json());

user_Router.get("/", (req, res) => {
  res.send("hello from user router !");
});

user_Router.post("/signup", (req, res, next) => {
  let user = new User(req.body);
  user
    .save()
    .then((user) => {
      req.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ status: "Success", user: user });
    })
    .catch((err) => next(err));
});

user_Router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      console.log({ user });
      console.log(typeof user.password);
      console.log(typeof req.body.password);
      if (user.password === req.body.password) {
        req.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ status: "Success", user: user });
      } else {
        next(new Error("you entered wrong password !!"));
      }
    })
    .catch((err) => next(err));
});
module.exports = user_Router;
