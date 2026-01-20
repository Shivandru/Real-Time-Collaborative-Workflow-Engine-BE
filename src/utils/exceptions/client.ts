import { HttpStatusCodes } from "../enums/http.ts";
import HttpException from "./HttpException.ts";

class BadRequestException extends HttpException {
    constructor(message: string = "Bad Request", data: unknown = {}) {
        super(HttpStatusCodes.ClientError.BAD_REQUEST, message, data);
    }
}

class UnauthorizedException extends HttpException {
    constructor(message: string = "Unauthorized", data: unknown = {}) {
        super(HttpStatusCodes.ClientError.UNAUTHORIZED, message, data);
    }
}

class ForbiddenException extends HttpException {
    constructor(message: string = "Forbidden", data: unknown = {}) {
        super(HttpStatusCodes.ClientError.FORBIDDEN, message, data);
    }
}

class NotFoundException extends HttpException {
    constructor(message: string = "Not Found", data: unknown = {}) {
        super(HttpStatusCodes.ClientError.NOT_FOUND, message, data);
    }
}

export { BadRequestException, UnauthorizedException, ForbiddenException, NotFoundException };
