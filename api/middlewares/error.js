import httpStatus from 'http-status';
import logger from '../config/logger.js';
import config from '../config/config.js';
import { ApiError } from '../utils/index.js';

class Error {

    errorConverter = (err, req, res, next) => {
        let error = err;
        if (!(error instanceof ApiError)) {
            const statusCode =
                error.statusCode ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
            const message = error.message || httpStatus[statusCode];
            error = new ApiError(statusCode, message, 'ERROR', false, err.stack);
        }
        next(error);
    };

    // eslint-disable-next-line no-unused-vars
    errorHandler = (err, req, res, next) => {
        let { statusCode, message } = err;
        if (config.env === 'production' && !err.isOperational) {
            statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
        }

        res.locals.errorMessage = err.message;

        const response = {
            code: statusCode,
            status: "ERROR",
            message,
            ...(config.env === 'development' && { stack: err.stack }),
        };

        if (config.env === 'development') {
            logger.error(err);
        }

        res.status(statusCode).send(response);
    };
}

export default new Error();
