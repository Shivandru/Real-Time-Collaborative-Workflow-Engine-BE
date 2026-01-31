import * as z from "zod";


export const createBoardSchema = z.object({
    title: z.string(),
    workspaceId: z.string(),
    visibility: z.enum(["PRIVATE", "WORKSPACE"]).default("WORKSPACE"),
    createdBy: z.string(),
});

export const boardSchema = createBoardSchema.extend({
    boardId: z.string(),
    createdAt: z.string(),
})

export const renameBoardSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters long"),
    boardId: z.string().min(1, "Board ID is required"),
    workspaceId: z.string().min(1, "Workspace ID is required"),
    createdBy: z.string().min(1, "User ID is required"),
})

export const changeBoardVisibilitySchema = z.object({
    boardId: z.string().min(1, "Board ID is required"),
    workspaceId: z.string().min(1, "Workspace ID is required"),
    createdBy: z.string().min(1, "User ID is required"),
    visibility: z.enum(["PRIVATE", "WORKSPACE"]).default("WORKSPACE"),
})

export const deleteBoardSchema = z.object({
    boardId: z.string().min(1, "Board ID is required"),
    workspaceId: z.string().min(1, "Workspace ID is required"),
    createdBy: z.string().min(1, "User ID is required"),
})


export type CreateBoard = z.infer<typeof createBoardSchema>;
export type Board = z.infer<typeof boardSchema>;
export type RenameBoard = z.infer<typeof renameBoardSchema>;
export type DeleteBoard = z.infer<typeof deleteBoardSchema>;
export type ChangeBoardVisibility = z.infer<typeof changeBoardVisibilitySchema>;