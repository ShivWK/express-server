const CustomError = require("./../Utils/CustomError");

const devError = (res, err) => {
    res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
        stackTrace: err.stack,
        error: err,
    })
}

const prodError = (res, err) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
        })
    } else {
        res.status(500).json({
            status: "error",
            message: "Something went wrong please try again later",
        })
    }
}

const castErrorHandler = (er) => {
    const msg = `Invalid value ${er.value} for ${er.path} field`;
    return new CustomError(msg, 400);
}

const duplicateKeyErrorHandler = (er) => {
    const msg = `There is already a movie with '${er?.keyValue?.name}' please try another name`;
    return new CustomError(msg, 400);
}

const validationErrorHandler = (err) => {
    const values = Object.values(err.errors);
    const messages = values.map(obj => obj.message);
    const msgStr = messages.join(". ");

    return new CustomError(msgStr, 400);
}

const tokenExpiredErrorHandler = (err) => {
    const msg = "JWT token expired please login again!";
    return new CustomError(msg, 401);
}

const invalidTokenErrorHandler = (err) => {
    const msg = `${err.message} please login again`;
    return new CustomError(msg, 401);
}

module.exports = (err, _, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        devError(res, err);
    } else if (process.env.NODE_ENV === "production") {
        let er = Object.assign(err);
        if (er.name === "CastError") er = castErrorHandler(er);
        if (er.code === 11000) er = duplicateKeyErrorHandler(er);
        if (er.name === "ValidationError") er = validationErrorHandler(er);
        if (er.name === "TokenExpiredError") er = tokenExpiredErrorHandler(er);
        if (er.name === "JsonWebTokenError") er = invalidTokenErrorHandler(er);


        prodError(res, er);
    }
} 