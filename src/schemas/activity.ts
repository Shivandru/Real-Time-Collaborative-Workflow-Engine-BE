import * as z from "zod";

export const eventTypeSchema = z.enum([
    "WorkspaceCreated",
    "WorkspaceRenamed",
    "MembersAdded",
    "MemberRemoved",
    "OwnerTransferred",
    "WorkspaceDeleted",

    "BoardCreated",
    "BoardRenamed",
    "BoardDeleted",
    "BoardVisibilityUpdated",
])

export const createActivitySchema = z.object({
    workspaceId: z.string(),
    boardId: z.string().optional(),
    // taskId: z.string().optional(),
  
    type: eventTypeSchema,
    actor: z.string(),
    payload: z.record(z.string(), z.any()).optional().default({}),
  });

export const activitySchema = createActivitySchema.extend({
    activityId: z.string(),
    createdAt: z.string()
})

export type Activity = z.infer<typeof activitySchema>;
export type CreateActivity = z.infer<typeof createActivitySchema>;
  
