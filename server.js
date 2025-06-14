const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
// const crypto = require("crypto");

// const key = crypto.randomBytes(64).toString("hex");
// console.log(key)

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught exception occured shutting down...");

  process.exit(1);
})

const app = require("./app");

mongoose.connect(process.env.REMOTE_CONN_STR, {
  // useNewUrlParser: true,
}).then(conn => {
  console.log("Connection Successful");
  // console.log(conn);
}).catch(err => {
  console.log("Error occured in making connection to te database")
  console.log(err.message);
})

// console.log(app.get("env"));
// console.log(process.env);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log("server has started...");
});

process.on("unhandledRejection", err => {
  console.log(err.message, err.name);
  console.log("Unhandled rejection occured shutting down...");

  server.close(() => {
    process.exit(1);
  })
})
