const User = require("./../Modals/userModel");
const asyncErrorHandler = require("./../Utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const CustomError = require("./../Utils/CustomError");
const util = require("util");
const sendEmail = require("./../Utils/email");
const crypto = require("crypto");

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
    console.log("Logged In User", user)

    if (isMatch) {
        const payload = {
            user_id: user._id,
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
});

exports.protect = asyncErrorHandler(async (req, res, next) => {
    // 1: Check token present or not,

    const testToken = req.headers.authorization;
    let token;

    if (testToken && testToken.startsWith("Bearer ")) {
        token = testToken.split(" ")[1];
    }

    if (!token) {
        return next(new CustomError("You are not logged in!", 401));
    }

    // 2: validate the token.

    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_KEY)
    // console.log(decodedToken);

    // try {
    //   const decode = jwt.verify(token, process.env.SECRET_KEY);
    //   console.log(decode)
    // } catch (err) {
    //   return next(err);
    // }

    // jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
    //   if (err) return next(err);
    //   console.log(data);
    // })

    // 3; check whether user exist in the database or not. Say user get deleted immediately after login

    const user = await User.findById(decodedToken.user_id);
    console.log(user)

    if (!user) {
        return next(new CustomError("User with the given token does not exist"));
    }

    // 4: Check if the user has changes the password after the token was issued

    const isPasswordChanged = await user.verifyIsPasswordChanged(decodedToken.iat);
    if (isPasswordChanged) {
        return next(new CustomError("Password has been changed recently. Please login again", 401))
    }

    // 5: Allow user to access the data by just calling next middleware in the stack
    req.user = user;
    next();
});

exports.restrict = (...role) => {
    return (req, res, next) => {
        if (role.includes(req.user.role)) {
            const err = new CustomError("You don't have permission to perform this action", 403);
            next(err);
        }
        next();
    }
};

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        const err = new CustomError("We could not find the user with the given email", 404);
        return next(err)
    }

    const resetToken = await user.createRandomToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
    const msg = `We have received a password reset request. Please use the below link to reset your password\n\n${resetUrl}\n\nThis reset password link will be valid only for 15 minutes.`

    try {
        await sendEmail({
            email: user.email,
            subject: "Password change request received",
            message: msg,
        })

        res.status(200).json({
            status: "success",
            message: "Password reset link send to the user email"
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiry = undefined;
        await user.save({ validateBeforeSave: false });

        console.log(err);
        return next(new CustomError("There was an error sending password reset email. Please try again later", 500))
    }
})

exports.passwordReset = asyncErrorHandler(async (req, res, next) => {
    const hashedResetToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({ passwordResetToken: hashedResetToken, passwordResetTokenExpiry: { $gt: Date.now() } });

    if (!user) {
        const err = new CustomError("Token is invalid or has expired");
        return next(err);
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();

    const payload = {
        user_id: user._id,
        email: user.email,
    }

    const key = process.env.SECRET_KEY;

    const token = tokenGenerator(payload, key);

    res.status(200).json({
        status: "success",
        token
    })
})

// Put below code in userController folder

exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user.id }).select("+password");

    const currentPassword = req.body.currentPassword;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (!currentPassword || !password || !confirmPassword) {
        return next(new CustomError("Please provide all current password, password, and confirm password", 401));
    }

    const isMatched = await user.verifyThePassword(currentPassword);

    if (!isMatched) {
        return next(new CustomError("Given current password doesn't match", 401));
    }

    user.password = password;
    user.confirmPassword = confirmPassword;
    user.passwordChangedAt = Date.now();

    await user.save();

    const payload = {
        user_id: user._id,
        email: user.email,
    }

    const key = process.env.SECRET_KEY;

    const token = tokenGenerator(payload, key);

    res.status(200).json({
        status: "success",
        token,
        data: {
            user: user
        }
    })
})

function filterReqObj(obj, ...allowedFields) {
    let reqObj = {};
    let keys = Object.keys(obj);

    for (let key of keys) {
        if (allowedFields.includes(key)) {
            reqObj[key] = obj[key];
        }
    }

    return reqObj;
}

exports.updateUserDetails = asyncErrorHandler(async (req, res, next) => {
    if (req.body.password || req.body.confirmPassword) {
        return next(new CustomError("You can't update password through this endpoint", 400));
    }

    if (Object.keys(req.body).length === 0) {
        // body is never null it is always an object ,it can be an empty object because user not given anything but it will be an object and object is a truthy value , so we are checking the number opf keys in it.
        return next(new CustomError("Please provide data to update", 400));
    }

    const filteredObject = filterReqObj(req.body, "name", "email");

    const user = await User.findByIdAndUpdate(req.user.id, filteredObject, { runValidators: true, new: true });

    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })

});

exports.deleteMeHandler = asyncErrorHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status: "success",
        data: null
    })
});

exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
    const users = await User.find().setOptions({bypassFilter: true});

    res.status(200).json({
        status: "success",
        total: users.length,
        data: {
            users
        }
    })
})