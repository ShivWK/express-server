const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required field!"],
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
    type: String,
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
    default: Date.now()
  }
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;