const express = require("express");
const authRouter = express.Router();
const { signup, login, protect, forgotPassword, passwordReset, updatePassword, updateUserDetails} = require("./../controllers/authController")

authRouter.route("/signup").post(signup); // /api/v1/users/signup
authRouter.route("/login").post(login);
authRouter.route("/forgotPassword").post(forgotPassword);
authRouter.route("/resetPassword/:token").patch(passwordReset);

// manage below routes with userController folder functions and userRouter

authRouter.route("/updatePassword").patch(protect, updatePassword);
authRouter.route("/updateMe").patch(protect, updateUserDetails);


module.exports = authRouter;