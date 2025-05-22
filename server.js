const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

mongoose.connect(process.env.REMOTE_CONN_STR, {
  // useNewUrlParser: true,
}).then(conn => {
  console.log("Connection Successful");
  // console.log(conn);
}).catch(err => {
  console.log("Error occured while connecting");
  console.log(err);
})

// console.log(app.get("env"));
// console.log(process.env);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("server has started...");
});
