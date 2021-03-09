const passport = require("passport");
const githubStrategy = require("passport-github2").Strategy;
const User = require("./models/users");

//serialize and deserialize user into session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

exports.deserialize = passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
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
      User.findOne({ email: profile.username })
        .then((user, err) => {
          if (err) return done(err);
          else if (user) return done(null, user);
          else {
            let user = new User({ email: profile.username });
            user.image = profile.photos[0].value;
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
