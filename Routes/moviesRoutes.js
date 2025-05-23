const express = require("express");
const morgan = require("morgan");
const router = express.Router();
const {
  checkId,
  getAllMovies,
  getSingleMovie,
  addANewMovie,
  updateAMovieByPut,
  updateAmovieByPatch,
  deleteAMovie,
  bodyValidater,
} = require("../controllers/moviesControllers");

// router.param("id", checkId);
router.use(express.json());
router.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});
// router.use(morgan("dev"));

router.route("/").get(getAllMovies).post(addANewMovie);
router
  .route("/:id")
  .get(getSingleMovie)
  .put(updateAMovieByPut)
  .patch(updateAmovieByPatch)
  .delete(deleteAMovie);

module.exports = router;
