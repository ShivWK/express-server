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

app.use(customMiddleware1);
app.use("/api/v1/movies", router);
app.use(customMiddleware2);

const PORT = 3000;
app.listen(PORT, () => {
  console.log("server has started...");
});
