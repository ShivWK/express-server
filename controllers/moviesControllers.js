const fs = require("fs");
const file = JSON.parse(fs.readFileSync("./movies.json"));

exports.checkId = (req, res, next, value) => {
  if (isNaN(value)) {
    return res.status(400).send({
      status: "failed",
      message: "id must be a number",
    });
  }

  const obj = file.find((item) => item.id === +value);

  if (!obj) {
    return res.status(404).json({
      status: "failed",
      message: "Movie with the give id not found",
    });
  }

  next();
};

exports.bodyValidater = (req, res, next) => {
  if (!req?.body?.name || !req?.body?.release) {
    return res.status(400).json({
      status : "failed",
      message: "Not a valid movie data"
    })
  }

  next();
}

exports.getAllMovies = (req, res) => {
  res.status(200).json({
    status: "success",
    count: file.length,
    requestedAt: req.requestedAt,
    data: {
      movies: file,
    },
  });
};

exports.getSingleMovie = (req, res) => {
  const askedId = req.params.id;
  const obj = file.find((item) => item.id === +askedId);

  // if (!obj) {
  //   return res.status(404).json({
  //     status: "failed",
  //     message: "Not found",
  //   });
  // }

  res.status(200).json({
    status: "success",
    requestedAt: req.requestedAt,
    data: {
      movie: obj,
    },
  });
};

exports.addANewMovie = (req, res) => {
  const id = file[file.length - 1].id + 1;
  const obj = Object.assign({ id }, req.body);
  file.push(obj);

  fs.writeFile("./movies.json", JSON.stringify(file), (err) => {
    if (err) {
      console.log(err);
    }
    res.status(201).json({
      status: "success",
      data: {
        movies: obj,
      },
    });
  });
};

exports.updateAMovieByPut = (req, res) => {
  const id = +req.params.id;

  // if (isNaN(id)) {
  //   return res.status(400).send({
  //     status: "failed",
  //     message: "id must be a number",
  //   });
  // }

  const obj = file.find((item) => item.id === id);

  // if (!obj) {
  //   return res.status(404).json({
  //     status: "failed",
  //     message: "Not found",
  //   });
  // }

  const index = file.indexOf(obj);
  const objToUpate = { id: obj.id, ...req.body };
  file[index] = objToUpate;

  fs.writeFile("./movies.json", JSON.stringify(file), (err) => {
    if (err) {
      res.status(500).json({
        status: "success",
        message: "Failed to write file",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: {
          movie: objToUpate,
        },
      });
    }
  });
};

exports.updateAmovieByPatch = (req, res) => {
  const id = +req.params.id;

  // if (isNaN(id)) {
  //   return res.status(400).send({
  //     status: "failed",
  //     message: "id must be a number",
  //   });
  // }

  const obj = file.find((item) => item.id === id);

  if (!obj) {
    return res.status(404).json({
      status: "failed",
      message: "Not found",
    });
  }
  const index = file.indexOf(obj);
  const objToUpate = { ...obj, ...req.body };
  file[index] = objToUpate;

  fs.writeFile("./movies.json", JSON.stringify(file), (err) => {
    if (err) {
      res.status(500).json({
        status: "success",
        message: "Failed to write file",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: {
          movie: objToUpate,
        },
      });
    }
  });
};

exports.deleteAMovie = (req, res) => {
  const id = +req.params.id;

  // if (isNaN(id)) {
  //   return res.status(400).send({
  //     status: "failed",
  //     message: "id must be a number",
  //   });
  // }

  const obj = file.find((item) => item.id === id);

  // if (!obj) {
  //   return res.status(404).send({
  //     status: "failed",
  //     message: "Not found",
  //   });
  // }

  const index = file.indexOf(obj);
  file.splice(index, 1);

  fs.writeFile("./movies.json", JSON.stringify(file), (err) => {
    if (err) {
      return res.status(500).send({
        status: "failed",
        message: "Failed to write file",
      });
    }
    res.status(204).json({
      status: "success",
      data: {
        movies: null,
      },
    });
  });
};
