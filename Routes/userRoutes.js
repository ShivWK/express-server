const express = require("express");
const authRouter = express.Router();
const { signup } = require("./../controllers/authController")

authRouter.route("/signup").post(signup); // /api/v1/users/signup

module.exports = authRouter;