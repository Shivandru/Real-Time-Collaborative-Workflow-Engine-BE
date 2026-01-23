import { env } from "../../config/env-validator.ts";
import type { User } from "../../schemas/user.ts";
import jwt from "jsonwebtoken";

class HelperFunction {
    public generateToken(user: User) {
        const { userId, email } = user;
        return jwt.sign({ userId, email }, env.JWT_SECRET, { expiresIn: "7d" });
    }
}

export const helperFunction = new HelperFunction();
