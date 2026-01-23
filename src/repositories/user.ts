import MongoConnection from "../config/db.ts";
import { userSchema, type User } from "../schemas/user.ts";

export class UserRepository {

    private get collection(){
        return MongoConnection.getInstance().getDb().collection("users");
    }

    async linkGoogle(userId: string, googleId: string){
        try {
            await this.collection.updateOne(
                {userId},
                {
                    $set: {
                        "auth.provider": "google",
                        "auth.googleId": googleId,
                    },
                    $unset:{
                        "auth.password": ""
                    }
                }
            )
        } catch (error) {
            throw new Error("error while linking the user")
        }
    }

    async findByEmail(email: string): Promise<User | null>{
        try {
            const user = await this.collection.findOne({ email });
            if(!user){
                // throw new NotFoundException(`user not found`);
                return null;
            }
            const { _id, ...rest } = user;
            const parsedUser = userSchema.safeParse(rest);
            if(!parsedUser.success){
                throw new Error(`Invalid User`);
            }
            return parsedUser.data;
        } catch (error) {
            throw new Error("error while getting the user")
        }
    }

    async createUser(user: User){
        try {
            await this.collection.insertOne(user);
        } catch (error) {
            throw new Error("error while creating the user")
        }
    }

    async getAllUsers(){
        try {
            const users = await this.collection.find().toArray();
            return users;
        } catch (error) {
            throw new Error("error while getting the user")
        }
    }
}