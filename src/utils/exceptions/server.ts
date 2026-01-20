import { HttpStatusCodes } from "../enums/http.ts";
import HttpException from "./HttpException.ts";


class InternalServerErrorException extends HttpException {
    constructor(message: string = "Internal Server Error", data: unknown = {}) {
        super(HttpStatusCodes.ServerError.INTERNAL_SERVER_ERROR, message, data);
    }
}

export { InternalServerErrorException };
