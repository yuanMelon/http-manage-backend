"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
class AppError {
    message;
    statusCode;
    error;
    constructor(statusCode, message, error) {
        this.message = message;
        this.statusCode = statusCode;
        this.error = error;
    }
}
exports.AppError = AppError;
const errorHandler = (cb) => {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        }
        catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).send({
                    error: {
                        code: error.statusCode,
                        message: error.message,
                    },
                });
            }
            else if (error instanceof Error) {
                res.status(500).send({
                    error: {
                        code: 500,
                        message: error.message,
                    },
                });
            }
            else {
                res.status(500).send({
                    error: {
                        code: 500,
                        message: "Unknown error",
                    },
                });
            }
        }
    };
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=Error.js.map