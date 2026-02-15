import type { Request, Response, NextFunction } from "express"
import { UnauthorizedException } from "../utils/exceptions/client.ts";
import { jwtManager } from "../utils/helpers/jwtHelper.ts";
export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    try {
        const access_token  = req.headers.authorization?.split(" ")[1];
        if(!access_token){
            throw new UnauthorizedException();
        }
        const decoded = jwtManager.verifyToken(access_token);
        req.user = decoded;
        next();
    } catch (error) {
        if((error instanceof Error) && error.name === "TokenExpiredError"){
            throw new UnauthorizedException();
        }
        next(new UnauthorizedException("INVALID_TOKEN"))
    }
}