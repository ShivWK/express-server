const User = require("./../Modals/userModel");
const asyncErrorHandler = require("./../Utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const CustomError = require("./../Utils/CustomError");

const tokenGenerator = (payload, secretKey) => {
    const metadata = {
        algorithm: "HS256",
        expiresIn: "15m",
        header: {
            typ: "JWT"
        }
    }

    return jwt.sign(payload, secretKey, metadata);
} 

exports.signup = asyncErrorHandler(async (req, res, next) => {
    const newUser = await User.create(req.body);

    const payLoad = {
        user_id: newUser._id,
        userEmail: newUser.email,
    }

    const secretKey = process.env.SECRET_KEY;

    const jwtToken = tokenGenerator(payLoad, secretKey)
    // console.log(jwtToken);

    res.status(201).json({
        status: "success",
        token: jwtToken,
        data: {
            user: newUser
        }
    })
});

exports.login = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = new CustomError("Please provide email ID and Password for login!", 400);
        return next(error);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        const err = new CustomError("User does not exist or incorrect email!", 404);
        return next(err);
    }

    const isMatch = await user.verifyThePassword(password, user.password);

    if (isMatch) {
        const payload = {
            user_Id: user._id,
            email: user.email,
        }

        const secretKey = process.env.SECRET_KEY;

        const jwtToken = tokenGenerator(payload, secretKey)

        res.status(200).json({
            status: "success",
            token: jwtToken,
        })
    } else {
        const err = new CustomError("Incorrect password", 400);
        return next(err);
    }
})