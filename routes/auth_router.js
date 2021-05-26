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
    let token = authenticate.getToken({ id: req.user._id });
    res.cookie("UTOF", token, {
      maxAge: "4d",
      httpOnly: true,
      sameSite: "lax",
    });
    res.redirect(process.env.APP_URL || "http://localhost:3000/");
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
  }),
  (req, res, next) => {
    let token = authenticate.getToken({ id: req.user._id });
    res.cookie("UTOF", token, {
      maxAge: "4d",
      httpOnly: true,
      sameSite: "lax",
    });
    res.redirect(process.env.APP_URL || "http://localhost:3000/");
  }
);

router.get("/failed", (req, res, next) => {
  res.statusCode = 401;
  res.end("error");
});
module.exports = router;
