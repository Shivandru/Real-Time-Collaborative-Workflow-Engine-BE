import type { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/exceptions/client.ts";
import jwt from "jsonwebtoken";
import { env } from "../config/env-validator.ts";

export function auth(req: Request, _res: Response, next: NextFunction){
    try {
        const token = req.cookies.access_token;
        if(!token){
            throw new UnauthorizedException("No token");
        }
        const payload = jwt.verify(token, env.JWT_SECRET);
        req.user = payload as { email: string, userId: string };
        next();
    } catch (error) {
        next(error);
    }
}