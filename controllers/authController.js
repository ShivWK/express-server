const User = require("./../Modals/userModel");
const asyncErrorHandler = require("./../Utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");

exports.signup = asyncErrorHandler(async (req, res, next) => {
    const newUser = await User.create(req.body);

    const payLoad = {
        user_id: newUser._id,
        userEmail: newUser.email,
    }

    const metadata = {
        algorithm: "HS256",
        expiresIn: "15m",
        header: {
            typ: "JWT"
        }
    }

    const secretKey = process.env.SECRET_KEY;

    const jwtToken = jwt.sign(payLoad, secretKey, metadata);
    console.log(jwtToken)

    res.status(201).json({
        status: "success",
        data : {
            user: newUser
        }
    })
});