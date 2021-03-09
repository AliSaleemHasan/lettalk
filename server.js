require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

//routes
const userRouter = require("./routes/user_router");
const authRouter = require("./routes/auth_router");
const port = 8080;

//mongoose connection
let connection = mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

connection
  .then((db) => {
    console.log("connected correctly to mongodb");
  })
  .catch((err) => console.log("mongodb connection error!"));

const app = express();
app.use(express.json());
app.use(
  session({
    secret: "fuck fear drank bear",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  if (req.user) res.send("fuck you " + req.user.username);
  else res.send("hello from server side ");
});

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.use((err, req, res, next) => {
  let output = {
    message: err.message,
    name: err.name,
    text: err.toString(),
  };
  let errStatus = err.status || 500;
  res.status(errStatus).send(output);
});
app.listen(process.env.PORT, () => {
  console.log(`connected correctly to http://localhost:${process.env.PORT}`);
});
