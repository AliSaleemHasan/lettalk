require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

//routes
const userRouter = require("./routes/user_router");

const port = 8080;
const app = express();
app.use(cors());
app.use(bodyParser.json());

let connection = mongoose.connect("mongodb://localhost:27017/chatApp", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
connection
  .then((db) => {
    console.log("connecting correctly to mongodb");
  })
  .catch((err) => console.log("mongodb connection error!"));
app.get("/", (req, res) => {
  res.send("hello from server side ");
});

app.use("/users", userRouter);

app.use((err, req, res) => {
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
