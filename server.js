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
  console.log("Error occurred while connecting");
  console.log(err);
})

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required field!"],
    unique: true,
  },
  description: String,
  duration:  {
    type: Number,
    required: [true, "Duration is required field!"]
  },
  rating:  {
    type: String,
    default: 1.0,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

const indianMovie= new Movie({
  name: "INDIA meri jaan",
  description: "A movie dedicated to the matayred soldirs of INDIA",
  duration: 250,
  rating: 5,
})


// console.log(app.get("env"));
// console.log(process.env);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("server has started...");
});
