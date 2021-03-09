const passport = require("passport");
const githubStrategy = require("passport-github2").Strategy;
const User = require("./models/users");

//serialize and deserialize user into session
passport.serializeUser((user, done) => {
  //add user id to cookie
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((error) => done(err));
});

//github strategy
exports.gitStrategy = passport.use(
  new githubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: "http://localhost:8080/auth/github/loggedIn",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      User.findById(profile.id).then((user, err) => {
        if (err) return done(err);
        else if (user) return done(null, user);
        else {
          let user = new User({ _id: profile.id, email: profile.email });
          user
            .save()
            .then((user) => {
              return done(null, user);
            })
            .catch((err) => console.log(err));
        }
      });
    }
  )
);
