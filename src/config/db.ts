import { MongoClient, Db } from "mongodb";
import { env } from "./env-validator.ts";

class MongoConnection {
    private static instance: MongoConnection;
    private client: MongoClient;
    private db?: Db
    private uri: string;
    private dbName: string;
    private constructor(uri: string, dbName: string){
        this.uri = uri;
        this.dbName = dbName;
        this.client = new MongoClient(this.uri);
    }

    static getInstance(): MongoConnection{
        if(!MongoConnection.instance){
            const uri = env.MONGO_DB_URI;
            const dbName = env.MONGO_DB_NAME;
            if(!uri || !dbName){
                throw new Error("mongo env variables not set")
            }
            MongoConnection.instance = new MongoConnection(uri, dbName);
        }
        return MongoConnection.instance
    }

    async connect(): Promise<Db>{
        try {
            if(!this.db){
                await this.client.connect();
                this.db = this.client.db(this.dbName);
                console.log(`✅ MongoDb connected`);
            }
            return this.db;
        } catch (error) {
            throw new Error(`Error while connection MongoDb`)
        }
    }

    getDb(): Db{
        if(!this.db){
            throw new Error(`MongoDB not connected`);
        }
        return this.db;
    }
}

export default MongoConnection;