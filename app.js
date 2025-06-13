const express = require("express");
const app = express();
const router = require("./Routes/moviesRoutes");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");
const CustomError = require("./Utils/CustomError");
const globalErrorHandler = require("./controllers/errorControllers");
const authRouter = require('./Routes/userRoutes');
// const checkToken= require("./controllers/moviesControllers")

let file = JSON.parse(fs.readFileSync("./form.json"));

const checkToken = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    // return res.status(401).json({
    //   status: "failed",
    //   message: "Unauthorized: No token provided"
    // })

    return next();
  }

  const token = authToken.split(" ")[1];

  if (token !== "abc123") {
    return res.status(403).json({ status: "failed", message: "Forbidden: Invalid token"})
  }

  next();
}

const upload = multer();

app.use(cors()); // study it well
app.use(checkToken);
app.use(express.json());
// app.use(express.urlencoded({extended: true}))

app.post("/api/formData", upload.any(), (req, res) => {
  let obj;

  if (file.length === 0) {
    const id = 1;
    obj = Object.assign({ id }, req.body);

    file.push(obj);
  } else {
    const id = file[file.length - 1].id + 1;
    obj = Object.assign({ id }, req.body);
    if(req.files && req.files.length > 0) {
      obj.file = req.files[0];
    }

    file.push(obj);
  }

  fs.writeFile("./form.json", JSON.stringify(file), (err) => {
    if (err) {
      res.status(500).json({
        status: "Failed",
        message: "Unable to Post data",
      });
    } else {
      res.status(201).json({
        status: "success",
        data: {
          form: obj,
        },
      });
    }
  });
});

app.get("/api/waitBaby", (req, res) => {
  setTimeout(() => {
    res.status(200).json({
      status: "success",
      message: "Sorry I'm late",
    });
  }, 4000);
});

app.get("/api/unstable-endpoint", (req, res) => {
  if (Math.random() < 0.5) {
    return res.status(500).json({
      status: "failed",
      message: "Temporary server error",
    })
  }

  res.status(200).json({
    status: "success",
    message: "Lucky man you got it!"
  })
})

app.use(express.static("./public"));
app.use("/api/v1/movies", router);
app.use("/api/v1/users", authRouter);

app.all(/(.*)/, (req, res, next) => {                                                                               

  // const err = new Error(`can't find ${req.originalUrl} on the server`);
  // err.status = "fail",
  // err.statusCode = 400;

  const err = new CustomError(`can't find ${req.originalUrl} on the server`, 400)
  next(err);
})

app.use(globalErrorHandler);

module.exports = app;
