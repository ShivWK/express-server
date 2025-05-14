const express = require("express");
const fs = require("fs");
const app = express();

const file = JSON.parse(fs.readFileSync("./movies.json"));

app.use(express.json());

app.get("/api/v1/movies", (req, res) => {
  res.status(200).json({
    status: "success",
    count: file.length,
    data: {
      movies: file,
    },
  });
});

app.get(["/api/v1/movies/:id", "/api/v1/movies/:id/:name"], (req, res) => {
  const askedId = req.params.id;
  const obj = file.find((item) => item.id === +askedId);

  if (!obj) {
    res.status(404).json({
      status: "failled",
      message: "Not found",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: {
        movie: obj,
      },
    });
  }
});

app.post("/api/v1/movies", (req, res) => {
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
});

app.put("/api/v1/movies/:id", (req, res) => {
  const id = +req.params.id;
  const obj = file.find((item) => item.id === id);

  console.log("Hit");
  if (!obj) {
    res.status(404).json({
      status: "failled",
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
          message: "Filed to write file",
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
});

app.patch("/api/v1/movies/:id", (req, res) => {
  const id = +req.params.id;
  const obj = file.find((item) => item.id === id);

  console.log("Hit");
  if (!obj) {
    res.status(404).json({
      status: "failled",
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
          message: "Filed to write file",
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
});

app.delete("/api/v1/movies/:id", (req, res) => {
  const id = +req.params.id;
  if (!id) {
    return res.status(400).send({
      status: "failed",
      message: "Valid id is required",
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
        message: "Filed to write file",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        movies: file,
      },
    });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("server has started...");
});
