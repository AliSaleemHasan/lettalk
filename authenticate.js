const passport = require("passport");
const githubStrategy = require("passport-github2").Strategy;
const google_straregy = require("passport-google-oauth2").Strategy;
const User = require("./models/users");
const jwt = require("jsonwebtoken");
const secret = "aoweifnowaiefnowaiefnwafeA WEFWAIPEFNWAE";

//serialize and deserialize user into session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

exports.deserialize = passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//get jwt

exports.getToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: "5d" });
};

//verify user middleware using cookies and jwt

exports.verifyJwt = (req, res, next) => {
  const token = req.cookies && req.cookies.UTOF;
  if (token) {
    jwt.verify(token, secret, (err, user) => {
      if (err) return res.status(401).json({ error: "user not found!" });
      req.user = user.id;
      next();
    });
  } else {
    res.status(200).json({ success: false });
  }
};

//github strategy
exports.gitStrategy = passport.use(
  new githubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: "http://localhost:8080/auth/github/loggedIn",
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ email: profile.username + profile.id + "@chaty.com" })
        .then((user, err) => {
          if (err) return done(err);
          else if (user) return done(null, user);
          else {
            let user = new User({
              email: profile.username + profile.id + "@chaty.com",
            });
            user.image = profile.photos[0].value;
            user.state.Oauth = true;
            user.bio = "Hey there,I am using Chaty!";
            user
              .save()
              .then((user) => {
                return done(null, user);
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    }
  )
);

//google Strategy
exports.googleStrategy = passport.use(
  new google_straregy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:8080/auth/google/loggedIn",
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ email: profile.emails[0] })
        .then((user, err) => {
          if (err) done(err);
          else if (user) done(null, user);
          else {
            let user = new User({
              email: profile.emails[0],
            });
            user.username = profile.displayName;
            user.bio = "Hey there,I am using Chaty!";
            user.image = profile.picture;
            user
              .save()
              .then((user) => done(null, user))
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    }
  )
);
