import * as z from "zod";
import { memberSchema } from "./workspace.ts";
import { ObjectId } from "mongodb";

export const listSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const createTaskSchema = z.object({
    title: z.string(),
    description: z.string(),
    members: z.array(memberSchema).default([]),
    boardId: z.string(),
    listId: listSchema,
    workspaceId: z.string(),
    createdBy: z.string(),
});

export const taskSchema = createTaskSchema.extend({
    taskId: z.string(),
    createdAt: z.string(),
});

export const updateTaskSchema = z.object({
    workspaceId: z.string(),
    boardId: z.string(),
    taskId: z.string(),
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    members: z.array(z.string()).min(1).optional(),
    listId: listSchema.optional(),
})

export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type CreateTask = z.infer<typeof createTaskSchema>;
export type Task = z.infer<typeof taskSchema>;
export type TaskDocument = Task & {
    _id: ObjectId;
  };
