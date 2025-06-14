const express = require("express");
const authRouter = express.Router();
const { signup, login } = require("./../controllers/authController")

authRouter.route("/signup").post(signup); // /api/v1/users/signup
authRouter.route("/login").post(login);

module.exports = authRouter;