const fs = require("fs");
const Movies = require("../Modals/movieModal");

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

exports.bodyValidater = (req, res, next) => {
  if (!req?.body?.name || !req?.body?.release) {
    return res.status(400).json({
      status : "failed",
      message: "Not a valid movie data"
    })
  }

  next();
}

// Route Handlers 

exports.getAllMovies = (req, res) => {
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

};

exports.getSingleMovie = (req, res) => {
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

};

exports.addANewMovie = (req, res) => {
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

};

exports.updateAMovieByPut = (req, res) => {
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

};

exports.updateAmovieByPatch = (req, res) => {
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

};

exports.deleteAMovie = (req, res) => {
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

};
