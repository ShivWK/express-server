const mongoose = require("mongoose");
const fs = require("fs");

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required field!"],
    maxlength: [100, "Movie name must not have more than 100 characters"],
    minlength: [4, "Movie name must have at least 4 characters"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, "description is required"],
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "Duration is required field!"]
  },
  rating: {
    type: Number,
    validate: {
      validator: function(value) {
        return value >= 1 && value <= 5;
      },

      message: "Rating {VALUE} should be 1 or above 1 but less than 6"
    },
    default: 1.0,
  },
  totalRating: {
    type: Number,
  },
  releaseYear: {
    type: Number,
    required: [true, "releaseYear is required"]
  },
  releaseDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  genres: {
    type: [String],
    enum: {
      values: ["Action", "Thriller", "Sci-Fi", "Crime", "Romance"],
      message: "Given genre doesn't exist"
    },
    required: [true, "genres field is required"]
  },
  createdBy: {
    type: String
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

movieSchema.pre("save", function (next) {
  this.createdBy = "Shivendra";
  console.log(this.name);
  next();
})

movieSchema.post("save", (doc, next) => {
  const content = `new movie added ${doc.name} \n`;
  fs.writeFileSync("./logs/movieLogs.txt", content, { flag: 'a' }, err => {
    console.log(err.message);
  })
  next();
})

movieSchema.pre(/^find/, function (next) {
  this.find({
    releaseYear: { $lte: new Date(Date.now()).getFullYear() }
  });
  this.startTime = Date.now();
  next();
})

movieSchema.post(/^find/, function (doc, next) {
  this.find({
    releaseYear: { $lte: new Date(Date.now()).getFullYear() }
  });
  this.endTime = Date.now();

  const content = `Query took ${this.endTime - this.startTime} milliseconds \n`;
  fs.writeFileSync("./logs/movieLogs.txt", content, { flag: 'a' }, err => {
    console.log(err.message);
  })
  next();
})

movieSchema.pre("aggregate", function(next) {
  this.pipeline().unshift({ $match: {releaseYear: {$lte: new Date().getFullYear()}}})
  console.log(this.pipeline());
  next();
})

movieSchema.post("aggregate", function(result, next) {
  console.log(this.pipeline());
  console.log(result.length)
  next();
})

movieSchema.virtual("durationInHours").get(function () {
  return this.duration / 60;
})
const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;