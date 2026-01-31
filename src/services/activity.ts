import { activityRepository } from "../repositories/activity.ts";
import { activitySchema, type Activity, type CreateActivity } from "../schemas/activity.ts";
import { BadRequestException } from "../utils/exceptions/client.ts";
import { InternalServerErrorException } from "../utils/exceptions/server.ts";
import {v4 as uuid} from "uuid";

class ActivityServices {
    async createActivity({workspaceId, type, actor, payload}: CreateActivity): Promise<Activity>{
        try {
            if(!workspaceId || !type || !actor){
                throw new BadRequestException("missing required fields");
            }
            const newActivity: Activity = {
                workspaceId,
                type,
                actor,
                payload,
                activityId: `a-${uuid()}`,
                createdAt: new Date().toISOString(),
            }
            await activityRepository.createActivity(newActivity);
            return activitySchema.parse(newActivity);
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }
}

export const activityServices = new ActivityServices();