const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const path = require("path");
//mongoose connection
exports.connection = mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27017/chatApp", {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
  })
  .then((db) => console.log("connected correctly to db"))
  .catch((err) => console.log(err));

//initialize gridfsSTorage
let connect = mongoose.connection;
let gfs;
connect.once("open", () => {
  //initialize Stream
  //Here we are using the native nodejs mongodb drice which the mongoose uses and creating a Fridfsbucket

  //we are giving one bucket name ,this bucket name will be used a name of collection

  gfs = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "uploads",
  });
});

const options = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/frontend/public/uploads");
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, Date.now() + "_" + file.fieldname + fileExtension);
  },
});

const storage = new GridFsStorage({
  url: process.env.MONGO_URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = Date.now() + "_" + file.originalname;

      const user_id = req.user;
      const fileInfo = {
        filename,
        user_id,
        bucketName: "uploads",
      };
      resolve(fileInfo);
    });
  },
});

exports.upload = multer({
  storage,
});

exports.uploadStorge = multer({
  storage: options,
});
