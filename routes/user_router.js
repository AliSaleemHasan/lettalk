const user_Router = require("express").Router();
const bodyParser = require("body-parser");

user_Router.use(bodyParser.json());

user_Router.get("/", (req, res) => {
  res.send("hello from user router !");
});

module.exports = user_Router;
