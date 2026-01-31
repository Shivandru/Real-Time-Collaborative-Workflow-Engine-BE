import * as z from "zod";

export const memberSchema = z.object({
    userId: z.string(),
    // role: z.enum(["OWNER", "ADMIN", "MEMBER"]).default("MEMBER"),
  });

export const createWorkspaceSchema = z.object({
    title: z.string(),
    createdBy: z.string(),
})

export const workspaceSchema = createWorkspaceSchema.extend({
    createdAt: z.string(),
    workspaceId: z.string(),
    members: z.array(z.string()).min(1),
})

export const renameWorkspaceSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters long"),
    workspaceId: z.string().min(1, "Workspace ID is required"),
    createdBy: z.string().min(1, "User ID is required"),
})

export const addMemberSchema = z.object({
    workspaceId: z.string(),
    members: z.array(z.string()).min(1, "atleast 1 member is required"),
    createdBy: z.string().min(1, "User ID is required"),
})

export const removeMemberSchema = z.object({
    workspaceId: z.string(),
    member: z.string().min(1, "atleast 1 member is required"),
    createdBy: z.string().min(1, "User ID is required"),
})

export const updateOwnerSchema = z.object({
    workspaceId: z.string(),
    createdBy: z.string().min(1, "User ID is required"),
    newOwner: z.string().min(1, "User ID is required"),
})


export type WorkSpace = z.infer<typeof workspaceSchema>;
export type CreateWorkspace = z.infer<typeof createWorkspaceSchema>;
export type RenameWorkspace = z.infer<typeof renameWorkspaceSchema>;
export type AddMembers = z.infer<typeof addMemberSchema>;
export type RemoveMember = z.infer<typeof removeMemberSchema>;
export type UpdateOwner = z.infer<typeof updateOwnerSchema>;