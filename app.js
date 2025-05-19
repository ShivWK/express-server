const express = require("express");
const app = express();
const router = require("./moviesRoutes");
const fs = require("fs");
const cors = require("cors");
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

app.use(cors()); // study it well
app.use(checkToken);
app.use(express.json());

const customMiddleware1 = (req, res, next) => {
  console.log("Midleware is Called 1");
  next();
};

const customMiddleware2 = (req, res, next) => {
  console.log("Midleware is Called 2");
  next();
};

app.post("/api/formData", (req, res) => {
  let obj;

  if (file.length === 0) {
    const id = 1;
    obj = Object.assign({ id }, req.body);

    file.push(obj);
  } else {
    const id = file[file.length - 1].id + 1;
    obj = Object.assign({ id }, req.body);

    file.push(obj);
  }

  fs.writeFile("./form.json", JSON.stringify(file), (err) => {
    if (err) {
      res.status(500).send({
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
    res.status(200).send({
      status: "success",
      message: "Sorry I'm late",
    });
  }, 4000);
});

app.get("/api/unstable-endpoint", (req, res) => {
  if (Math.random() < 0.5) {
    return res.status(500).send({
      status: "failed",
      message: "Temporary server error",
    })
  }

  res.status(200).send({
    status: "success",
    message: "Lucky man you got it!"
  })
})

app.use(express.static("./public"));
app.use(customMiddleware1);
app.use(customMiddleware2);
app.use("/api/v1/movies", router);

module.exports = app;
