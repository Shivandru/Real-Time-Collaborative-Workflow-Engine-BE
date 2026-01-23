import type { Request, Response, NextFunction } from "express";
import HttpException from "../utils/exceptions/HttpException.ts";
import { HttpStatusCodes } from "../utils/enums/http.ts";

export default async function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof HttpException) {
        res.status(err.statusCode).json(err);
        return;
    }

    // sysLogger.error(err.message);
    res.status(HttpStatusCodes.ServerError.INTERNAL_SERVER_ERROR).json({
        message: err instanceof Error ? err.message : "Internal Server Error",
    });
}
