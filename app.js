const express = require("express");
const app = express();
const router = require("./moviesRoutes");

const customMiddleware1 = (req, res, next) => {
  console.log("Midleware is Called 1");
  next();
}

const customMiddleware2 = (req, res, next) => {
  console.log("Midleware is Called 2");
  next();
}

app.use(express.static("./public"));
app.use(customMiddleware1);
app.use(customMiddleware2);
app.use("/api/v1/movies", router);

module.exports = app;