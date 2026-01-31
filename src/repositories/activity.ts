import MongoConnection from "../config/db.ts";
import type { Activity } from "../schemas/activity.ts";
import { InternalServerErrorException } from "../utils/exceptions/server.ts";

class ActivityRepository {
    private get collection(){
        return MongoConnection.getInstance().getDb().collection<Activity>("activities");
    }

    async createActivity(activity: Activity): Promise<void>{
        try {
            await this.collection.insertOne(activity);
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }
}

export const activityRepository = new ActivityRepository();