const user_Router = require("express").Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const express = require("express");
const deserialize = require("../authenticate").deserialize;

user_Router.use(express.json());
user_Router.get("/", (req, res) => {
  console.log(req.session);
  if (req.user) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: true, user: req.user });
  } else {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: true, user: null });
  }
});

user_Router.post("/signup", (req, res, next) => {
  let hash = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hash;
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
      if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json({ status: "failed" });
      } else {
        req.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ status: "Success", user: user });
      }
    })
    .catch((err) => next(err));
});
module.exports = user_Router;
