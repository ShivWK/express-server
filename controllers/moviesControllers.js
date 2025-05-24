const fs = require("fs");
const Movie = require("../Modals/movieModal");
const qs = require('qs');

// const file = JSON.parse(fs.readFileSync("./movies.json"));

// Middlewares

// exports.checkToken = (req, res, next) => {
//   console.log(req, res);

//   const authToken = req.headers.authorization;

//   if (!authToken) {
//     return res.status(401).json({
//       status: "failed",
//       message: "Unauthorized: No token provided"
//     })
//   }

//   const token = authToken.split(" ")[1];

//   if (token !== "abc123") {
//     return res.status(403).json({ status: "failed", message: "Forbidden: Invalid token"})
//   }

//   next();
// }

// exports.checkId = (req, res, next, value) => {
//   if (isNaN(value)) {
//     return res.status(400).send({
//       status: "failed",
//       message: "id must be a number",
//     });
//   }

//   const obj = file.find((item) => item.id === +value);

//   if (!obj) {
//     return res.status(404).json({
//       status: "failed",
//       message: "Movie with the give id not found",
//     });
//   }

//   next();
// };

// exports.bodyValidater = (req, res, next) => {
//   if (!req?.body?.name || !req?.body?.duration) {
//     return res.status(400).json({
//       status: "failed",
//       message: "Not a valid movie data"
//     })
//   }

//   next();
// }

// Route Handlers 

exports.getAllMovies = async (req, res) => {
// When worked with text JSON file

  // res.status(200).json({
  //   status: "success",
  //   count: file.length,
  //   requestedAt: req.requestedAt,
  //   data: {
  //     movies: file,
  //   },
  // });

// Wroking with database

  try {
    // const docs = await Movie.find({duration: +req.query.duration, rating: +req.query.rating});
    // const docs = await Movie.find(req.query);
    // const docs = await Movie.find()
    //         .where("duration")
    //         .equals(req.query.duration)
    //         .where("rating")
    //         .equals(req.query.rating);

    const searchParams = qs.parse(req.query);
    const searchStr = JSON.stringify(searchParams);
    const newSearchParams = JSON.parse(searchStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`));

    console.log(newSearchParams);
    // const docs = await Movie.find({duration: {$gte: req.query.duration}, rating: {$lte: req.query.rating}})

    const docs = await Movie.find(newSearchParams);

    res.status(200).json({
      status: "success",
      length: docs.length,
      data: {
        movies: docs,
      }
    })

  } catch(err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    })
  }
};



exports.getSingleMovie = async (req, res) => {
// When worked with text JSON file

  // const askedId = req.params.id;
  // const obj = file.find((item) => item.id === +askedId);

  // res.status(200).json({
  //   status: "success",
  //   requestedAt: req.requestedAt,
  //   data: {
  //     movie: obj,
  //   },
  // });

// Wroking with database

  try {
    const movie = await Movie.findById(req.params.id)
    res.status(200).json({
      status: "success",
      data: { movie }
    })
  } catch(err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    })
  }
};

exports.addANewMovie = async (req, res) => {
  // When worked with text JSON file

  // const id = file[file.length - 1].id + 1;
  // const obj = Object.assign({ id }, req.body);
  // file.push(obj);

  // fs.writeFile("./movies.json", JSON.stringify(file), (err) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   res.status(201).json({
  //     status: "success",
  //     data: {
  //       movies: obj,
  //     },
  //   });
  // });

// Wroking with database

  try {                          
    const doc = await Movie.create(req.body);        
    res.status(201).json({
      status: "success",
      data: {
        movie: doc,
      }
    })
  } catch (err) {
    // thing in what cases the request can be rejected

    res.status(400).json({
      status: "failed ji",
      message: err.message
    })
  }

};

exports.updateAMovieByPut = async (req, res) => {
  // When worked with text JSON file

  // const id = +req.params.id;

  // const obj = file.find((item) => item.id === id);

  // const index = file.indexOf(obj);
  // const objToUpdate = { id: obj.id, ...req.body };
  // file[index] = objToUpdate;

  // fs.writeFile("./movies.json", JSON.stringify(file), (err) => {
  //   if (err) {
  //     res.status(500).json({
  //       status: "success",
  //       message: "Failed to write file",
  //     });
  //   } else {
  //     res.status(200).json({
  //       status: "success",
  //       data: {
  //         movie: objToUpdate,
  //       },
  //     });
  //   }
  // });

  // Wroking with database

  const { name, description, duration, rating} = req.body;

  if (!name || !description || !duration || !rating) {
    res.status(400).json({
      status: "failed",
      message: "Invalid movie data"
    })
  }

  try {
      const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
      res.status(200).json({
        status: "success",
        data: {
          movie
        }
      })
    } catch(err) {
      res.status(404).json({
        status: "failed",
        message: err.message,
      })
    }
    
}

exports.updateAmovieByPatch = async (req, res) => {
  // When worked with text JSON file

  // const id = +req.params.id;

  // const obj = file.find((item) => item.id === id);

  // if (!obj) {
  //   return res.status(404).json({
  //     status: "failed",
  //     message: "Not found",
  //   });
  // }
  // const index = file.indexOf(obj);
  // const objToUpdate = { ...obj, ...req.body };
  // file[index] = objToUpdate;

  // fs.writeFile("./movies.json", JSON.stringify(file), (err) => {
  //   if (err) {
  //     res.status(500).json({
  //       status: "success",
  //       message: "Failed to write file",
  //     });
  //   } else {
  //     res.status(200).json({
  //       status: "success",
  //       data: {
  //         movie: objToUpdate,
  //       },
  //     });
  //   }
  // });

// Wroking with database

  try {
      const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
      res.status(200).json({
        status: "success",
        data: {
          movie
        }
      })
    } catch(err) {
      res.status(404).json({
        status: "failed",
        message: err.message,
      })
    }
};

exports.deleteAMovie = async (req, res) => {
  // When worked with text JSON file

  // const id = +req.params.id;
  // const obj = file.find((item) => item.id === id);
  // const index = file.indexOf(obj);

  // file.splice(index, 1);

  // fs.writeFile("./movies.json", JSON.stringify(file), (err) => {
  //   if (err) {
  //     return res.status(500).json({
  //       status: "failed",
  //       message: "Failed to write file",
  //     });
  //   }
  //   res.status(204).json({
  //     status: "success",
  //     data: {
  //       movies: null,
  //     },
  //   });
  // });

  // Wroking with database

  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      message: null
    })
  } catch(err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    })
  }
};
