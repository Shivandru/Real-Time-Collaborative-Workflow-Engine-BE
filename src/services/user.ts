import { UserRepository } from "../repositories/user.ts";
import { userSchema, type User, type UserInputGoogle, type UserInputLocal } from "../schemas/user.ts";
import { ConflictException, NotFoundException } from "../utils/exceptions/client.ts";
import { InternalServerErrorException } from "../utils/exceptions/server.ts";
import { AuthServices } from "./auth.ts";

class Userservices {
    private repo = new UserRepository();
    async signUpwithLocal(userInput: UserInputLocal): Promise<User>{
        try {
            const existingUser = await this.repo.findByEmail(userInput.email);
            if(existingUser){
                throw new ConflictException("Something went wrong while creating the user");
            }
            const user = await AuthServices.createLocalUser(userInput);
            await this.repo.createUser(user);
            return userSchema.parse(user);
        } catch (error) {
            throw new InternalServerErrorException(`error while creating the user`);
        }
    }

    async loginUpwithGoogle(userInput: UserInputGoogle){
        const existing = await this.repo.findByEmail(userInput.email);
        if(!existing){
            const user = AuthServices.createGoogleUser(userInput);
            await this.repo.createUser(user);
            return user;
        }
        if(existing.auth.provider === "local"){
            await this.repo.linkGoogle(existing.userId, userInput.googleId);
            return {...existing, auth: {
                ...existing.auth,
                googleId: userInput.googleId,
            }}
        }
        return existing;
    }
    async getUsers(){
        try {
            const users = await this.repo.getAllUsers();
            return users;
        } catch (error) {
            throw new Error(`error from get users: ${error instanceof Error ? error.message : "error while creating the user"}`);
        }
    }

    async getUser(email: string){
        try {
            const user = await this.repo.findByEmail(email);
            if(!user){
                throw new NotFoundException("User not found");
            }
            return user;
        } catch (error) {
            throw new Error(`error from get user: ${error instanceof Error ? error.message : "error while creating the user"}`);
        }
    }
}

export const userservices = new Userservices();
