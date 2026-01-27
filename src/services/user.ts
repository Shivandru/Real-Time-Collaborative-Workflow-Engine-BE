import { UserRepository } from "../repositories/user.ts";
import { userSchema, type CreateUser, type User } from "../schemas/user.ts";
import { NotFoundException } from "../utils/exceptions/client.ts";
import { InternalServerErrorException } from "../utils/exceptions/server.ts";
import { v4 as uuid } from "uuid";

class Userservices {
    private repo = new UserRepository();

    async handleUser({ username, email }: CreateUser): Promise<User> {
        try {
            const existingUser = await this.repo.findByEmail(email);
            if (existingUser) {
                return userSchema.parse(existingUser);
            }
            const newUser: User = {
                username,
                email,
                userId: `u-${uuid()}`,
                createdAt: String(Date.now()),
            }
            return await this.repo.createUser(newUser);
        } catch (error) {
            throw new InternalServerErrorException(`error while creating the user`);
        }
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
