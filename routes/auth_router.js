const express = require("express");
const router = express.Router();
const passport = require("passport");
const authenticate = require("../authenticate");
router.use(express.json());

router.get("/github", passport.authenticate("github"));

router.get(
  "/github/loggedIn",
  passport.authenticate("github", { failureRedirect: "/auth/failed" }),
  (req, res) => {
    res.redirect("http://localhost:3000/");
  }
);

//google routes

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/google/loggedIn",
  passport.authenticate("google", {
    failureRedirect: "/auth/failed",
    successRedirect: "http://localhost:3000/",
  })
);

router.get("/failed", (req, res, next) => {
  res.statusCode = 401;
  res.end("error");
});
module.exports = router;