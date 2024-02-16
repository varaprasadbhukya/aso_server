class ApiError extends Error {
    constructor(statusCode, message, status = 'FAILED', isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.status = status
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;