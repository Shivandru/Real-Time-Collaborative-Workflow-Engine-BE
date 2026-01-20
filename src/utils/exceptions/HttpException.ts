export default class HttpException extends Error {
    public readonly statusCode: number;
    public readonly message: string;
    public readonly data?: unknown;

    constructor(statusCode: number, message: string = "An error occurred", data?: unknown) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;

        // Maintain proper stack trace (only available in V8 engines)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
