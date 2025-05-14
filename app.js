const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const app = express();

const file = JSON.parse(fs.readFileSync("./movies.json"));

app.use(express.json());
app.use((req, res, next)=> {
  req.requestedAt = new Date().toISOString();
  next();
});
app.use(morgan("dev"));

const customMiddleware1 = (req, res, next) => {
  console.log("Midleware is Called 1");
  next();
}

const customMiddleware2 = (req, res, next) => {
  console.log("Midleware is Called 2");
  next();
}

app.use(customMiddleware1);

const getAllMovies = (req, res) => {
  res.status(200).json({
    status: "success",
    count: file.length,
    requestedAt: req.requestedAt,
    data: {
      movies: file,
    },
  });
};

const getSingleMovie = (req, res) => {
  const askedId = req.params.id;
  const obj = file.find((item) => item.id === +askedId);

  if (!obj) {
    res.status(404).json({
      status: "failed",
      message: "Not found",
    });
  } else {
    res.status(200).json({
      status: "success",
      requestedAt: req.requestedAt,
      data: {
        movie: obj,
      },
    });
  }
};

const addANewMovie = (req, res) => {
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

const updateAMovieByPut = (req, res) => {
  const id = +req.params.id;

  if (isNaN(id)) {
    return res.status(400).send({
      status: "failed",
      message: "id must be a number",
    });
  }

  const obj = file.find((item) => item.id === id);

  console.log("Hit");
  if (!obj) {
    res.status(404).json({
      status: "failed",
      message: "Not found",
    });
  } else {
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
  }
};

const updateAmovieByPatch = (req, res) => {
  const id = +req.params.id;

  if (isNaN(id)) {
    return res.status(400).send({
      status: "failed",
      message: "id must be a number",
    });
  }

  const obj = file.find((item) => item.id === id);

  console.log("Hit");
  if (!obj) {
    res.status(404).json({
      status: "failed",
      message: "Not found",
    });
  } else {
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
  }
};

const deleteAMovie = (req, res) => {
  const id = +req.params.id;

  if (isNaN(id)) {
    return res.status(400).send({
      status: "failed",
      message: "id must be a number",
    });
  }

  const obj = file.find((item) => item.id === id);

  if (!obj) {
    return res.status(404).send({
      status: "failed",
      message: "Not found",
    });
  }
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

app.route("/api/v1/movies").get(getAllMovies).post(addANewMovie);

app.use(customMiddleware2);

app.route("/api/v1/movies/:id")
  .get(getSingleMovie)
  .put(updateAMovieByPut)
  .patch(updateAmovieByPatch)
  .delete(deleteAMovie);

const PORT = 3000;
app.listen(PORT, () => {
  console.log("server has started...");
});
