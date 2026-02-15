import * as z from "zod";


export const createTaskSchema = z.object({
    title: z.string(),
    description: z.string(),
    members: z.array(z.string()).default([]),
    boardId: z.string(),
    boardListId: z.string(),
    workspaceId: z.string(),
    createdBy: z.string(),
    labels: z.array(z.string()).default([])
});

export const taskSchema = createTaskSchema.extend({
    taskId: z.string(),
    createdAt: z.string(),
});

export const baseTaskIdentifiers = z.object({
    taskId: z.string(),
    workspaceId: z.string(),
    boardId: z.string(),
    boardListId: z.string(),
    createdBy: z.string(),
  });

export const renameTaskSchema = baseTaskIdentifiers.extend({
    title: z.string().min(2, "Title must be at least 2 characters long"),
})

export const updateDescriptionTaskSchema = baseTaskIdentifiers.extend({
    description: z.string(),
})

export const updateMembersSchema = baseTaskIdentifiers.extend({
    members: z.array(z.string()).min(1, "atleast 1 member is required"),
})

export const updateLabelsSchema = baseTaskIdentifiers.extend({
    labels: z.array(z.string()).min(1, "atleast 1 label is required"),
})


export type UpdateLabelsTask = z.infer<typeof updateLabelsSchema>;
export type BaseTaskIdentifiers = z.infer<typeof baseTaskIdentifiers>;
export type UpdateMembersTask = z.infer<typeof updateMembersSchema>;
export type UpdateDescriptionTask = z.infer<typeof updateDescriptionTaskSchema>;
export type RenameTask = z.infer<typeof renameTaskSchema>;
export type CreateTask = z.infer<typeof createTaskSchema>;
export type Task = z.infer<typeof taskSchema>;

