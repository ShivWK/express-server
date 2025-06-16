const express = require("express");
const authRouter = express.Router();
const { signup, login, protect, forgotPassword, passwordReset, updatePassword} = require("./../controllers/authController")

authRouter.route("/signup").post(signup); // /api/v1/users/signup
authRouter.route("/login").post(login);
authRouter.route("/forgotPassword").post(forgotPassword);
authRouter.route("/resetPassword/:token").patch(passwordReset);
authRouter.route("/updatePassword").patch(protect, updatePassword);

module.exports = authRouter;