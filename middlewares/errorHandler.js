const handleError = (error, req, res, next) => {
    let msg = "Internal Server Error";
    let status = 500;
    let code = 5; // default: server error
    let data = null;

    switch (error.name) {
        case "SequelizeValidationError":
        case "SequelizeUniqueConstraintError":
            status = 400;
            code = 4;
            msg = error.errors?.[0]?.message || "Validation failed";
            break;

        case "ValidationError":
            status = 400;
            code = 4;
            msg = error.message || "Validation failed";
            break;

        case "EmailOrPasswordRequired":
            status = 400;
            code = 4;
            msg = "Email or password required";
            break;

        case "InvalidCredentials":
            status = 401;
            code = 4;
            msg = "Invalid username, email or password";
            break;

        case "Unauthenticated":
        case "JsonWebTokenError":
            status = 401;
            code = 4;
            msg = "Must login first";
            break;

        case "Forbidden":
            status = 403;
            code = 4;
            msg = "You don't have access";
            break;

        case "errorNotFound":
            status = 404;
            code = 4;
            msg = "Error not found";
            break;

        case "PayloadTooLargeError":
            status = 413;
            code = 4;
            msg = "Uploaded file too large";
            break;

        case "MulterError":
            status = 400;
            code = 4;
            msg = error.message || "File upload error";
            break;

        case "SequelizeDatabaseError":
        case "SequelizeConnectionError":
        case "SequelizeConnectionRefusedError":
            status = 500;
            code = 5;
            msg = "Database error";
            break;

        case "TooManyRequests":
            status = 429;
            code = 4;
            msg = "Too many requests, please try again later";
            break;

        case "FileNotFound":
            status = 404;
            code = 4;
            msg = "File not found";
            break;

        default:
            console.error(error); // log biar bisa di-debug
            msg = error.message || msg;
            if (process.env.NODE_ENV !== "production") {
                data = error.stack;
            }
            break;
    }

    res.status(status).json({
        code,
        message: msg,
        data,
    });
};

module.exports = handleError;
