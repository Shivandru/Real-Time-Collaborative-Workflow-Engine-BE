import { userRepository } from "../repositories/user.ts";
import { userSchema, type CreateUser, type User } from "../schemas/user.ts";
import { NotFoundException } from "../utils/exceptions/client.ts";
import { InternalServerErrorException } from "../utils/exceptions/server.ts";
import { v4 as uuid } from "uuid";
import { jwtManager } from "../utils/helpers/jwtHelper.ts";

class Userservices {

    async signUpLogin({ username, email }: CreateUser): Promise<{user: User, token: string }> {
        try {
            const existingUser = await userRepository.findByEmail(email);
            let user: User;
            if (existingUser) {
                user = userSchema.parse(existingUser);
            }else{
                const newUser: User = {
                    username,
                    email,
                    userId: `u-${uuid()}`,
                    createdAt: String(Date.now()),
                }
                user = await userRepository.createUser(newUser);
            }
            
            const token = jwtManager.generateToken({
                userId: user.userId,
                email: user.email,
                username: user.username
            });
            return { user, token }
        } catch (error) {
            throw new InternalServerErrorException(`error while creating the user`);
        }
    }
    async getUsers(){
        try {
            const users = await userRepository.getAllUsers();
            return users;
        } catch (error) {
            throw new Error(`error from get users: ${error instanceof Error ? error.message : "error while creating the user"}`);
        }
    }

    async getUser(email: string){
        try {
            const user = await userRepository.findByEmail(email);
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
