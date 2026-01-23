import { helperFunction } from '../utils/helpers/helperFuntions.ts';
import {v4 as uuid} from "uuid";
import bcrypt from "bcrypt";
import type { User, UserInputGoogle, UserInputLocal } from "../schemas/user.ts";
import { env } from "../config/env-validator.ts";
import type { UserRepository } from "../repositories/user.ts";
import { UnauthorizedException } from "../utils/exceptions/client.ts";
export class AuthServices {
    static async createLocalUser(input: UserInputLocal): Promise<User>{
            const hasedPassword = await bcrypt.hash(input.password, env.SALT_ROUND);
            const userId = `u-${uuid()}`
            return {
                userId,
                username: input.username,
                email: input.email,
                auth: {
                    provider: "local",
                    password: hasedPassword,
                    googleId: null
                },
                createdAt: Date.now().toString()
            }
    }

    static createGoogleUser(input: UserInputGoogle): User{
        return {
            userId: `u-${uuid()}`,
            username: input.username,
            email: input.email,
            auth: {
                provider: "google",
                googleId: input.googleId,
                password: null
            },
            createdAt: Date.now().toString()
        }
    }
}

export class PasswordAuthStrategy {
    async authenticate(email: string, password: string, repo: UserRepository): Promise<User>{
        try {
            const user = await repo.findByEmail(email);
            if(!user || user.auth.provider !== "local"){
                throw new UnauthorizedException("Invalid credentials");
            }
            const match = await bcrypt.compare(password, user.auth.password);
            if(!match){
                throw new UnauthorizedException("Invalid credentials");
            }
            return user;
        } catch (error) {
            throw error;
        }
    }
}

export class TokenServices {
    public generate(user: User){
        return helperFunction.generateToken(user);
    }
}

