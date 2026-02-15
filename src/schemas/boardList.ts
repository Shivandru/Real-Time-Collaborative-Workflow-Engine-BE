import * as z from "zod";

export const createboardListSchema = z.object({
    title: z.string(),
    boardId: z.string(),
    workspaceId: z.string(),
    createdBy: z.string(),
})

export const boardListSchema = createboardListSchema.extend({
    boardListId: z.string(),
    createdAt: z.string(),
})

export const renameBoardListSchema = z.object({
    boardListId: z.string().min(1, "Board List ID is required"),
    workspaceId: z.string().min(1, "Workspace ID is required"),
    boardId: z.string(),
    title: z.string().min(2, "Title must be at least 2 characters long"),
})

export const deleteBoardListSchema = z.object({
    boardListId: z.string().min(1, "Board List ID is required"),
    workspaceId: z.string().min(1, "Workspace ID is required"),
    boardId: z.string().min(1, "Board ID is required"),
})

export type DeleteBoardList = z.infer<typeof deleteBoardListSchema>;
export type BoardList = z.infer<typeof boardListSchema>;
export type CreateBoardList = z.infer<typeof createboardListSchema>;
export type RenameBoardList = z.infer<typeof renameBoardListSchema>;