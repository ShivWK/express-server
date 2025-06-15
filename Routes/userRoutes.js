const express = require("express");
const authRouter = express.Router();
const { signup, login, forgotPassword, passwordReset} = require("./../controllers/authController")

authRouter.route("/signup").post(signup); // /api/v1/users/signup
authRouter.route("/login").post(login);
authRouter.route("/forgotPassword").post(forgotPassword);
authRouter.route("/resetPassword/:token").patch(passwordReset);

module.exports = authRouter;