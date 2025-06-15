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
  queryProvider,
  getMovieStats,
  getMovieByGenre,
} = require("../controllers/moviesControllers");

const {
  protect,
  restrict
} = require("./../controllers/authController");

// router.param("id", checkId);
router.use(express.json());
router.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});
// router.use(morgan("dev"));

router.route("/topRatedMovies").get(queryProvider, getAllMovies)
router.route("/").get(protect, getAllMovies).post(addANewMovie);
router.route("/movies-stats").get(getMovieStats);
router.route("/getByGenre/:genre").get(getMovieByGenre);

router
  .route("/:id")
  .get(getSingleMovie)
  .put(updateAMovieByPut)
  .patch(updateAmovieByPatch)
  .delete(protect ,restrict("superUser", "user"), deleteAMovie);

module.exports = router;
