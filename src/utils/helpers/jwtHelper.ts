import { env } from "../../config/env-validator.ts";
import type { JwtPayload } from "../../schemas/jwt.ts";
import jwt from "jsonwebtoken";
import type { Secret } from "jsonwebtoken";
import type { StringValue } from "ms";

class JwtTokenManager {
    private jwtSecret: Secret;
    private expiresIn: StringValue | number;

    constructor(){
        this.jwtSecret = env.JWT_SECRET || "secret";
        this.expiresIn = "7d";
    }
    public generateToken(payload: JwtPayload): string {
        return jwt.sign(
            payload, 
            this.jwtSecret,
            { expiresIn: this.expiresIn }
        );
    }

    public verifyToken(token: string): JwtPayload {
        return jwt.verify(token, this.jwtSecret) as JwtPayload;
    }
}

export const jwtManager = new JwtTokenManager();