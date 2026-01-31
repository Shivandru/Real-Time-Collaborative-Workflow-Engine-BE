import { workSpaceRepository } from "../repositories/workspace.ts";
import { workspaceSchema, type CreateWorkspace, type WorkSpace } from "../schemas/workspace.ts";
import { BadRequestException, NotFoundException } from "../utils/exceptions/client.ts";
import { InternalServerErrorException } from "../utils/exceptions/server.ts";
import {v4 as uuid} from "uuid";
import { activityServices } from "./activity.ts";
import { title } from "node:process";

class WorkSpaceServices {
    async createWorkspace({ title, createdBy }:CreateWorkspace): Promise<WorkSpace>{
        try {
            const workspace: WorkSpace = {
                workspaceId: `w-${uuid()}`,
                title,
                createdBy,
                members: [createdBy],
                createdAt: new Date().toISOString(),
              };
            await workSpaceRepository.create(workspace);
            await activityServices.createActivity({workspaceId: workspace.workspaceId, type: "WorkspaceCreated", actor: createdBy, payload: { title: "Workspace Created" }});
            return workspaceSchema.parse(workspace);
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }

    async getAllWorkspaces(): Promise<WorkSpace[]>{
        try {
            const workspaces = await workSpaceRepository.getWorkSpaces();
            return workspaces;
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }

    async getWorkSpace(workspaceId: string): Promise<WorkSpace | null>{
        try {
            const workspace = await workSpaceRepository.getWorkSpace(workspaceId);
            if(!workspace){
                throw new NotFoundException("Workspace not found");
            }
            return workspaceSchema.parse(workspace);
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }

    async renameWorkspace(workspaceId: string, title: string, createdBy: string): Promise<WorkSpace | null>{
        try {
            if(!workspaceId){
                throw new BadRequestException("Workspace id is required");
            }
            const workspace = await workSpaceRepository.renameWorkspace({workspaceId, title, createdBy});
            if(!workspace){
                throw new NotFoundException("Workspace not found");
            }
            await activityServices.createActivity({workspaceId: workspace.workspaceId, type: "WorkspaceRenamed", actor: createdBy, payload: { title: "Workspace Renamed" }});
            return workspaceSchema.parse(workspace);
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }

    async addMembers(workspaceId: string, members: string[], createdBy: string): Promise<WorkSpace | null>{
        try {
            if(!workspaceId){
                throw new BadRequestException("Workspace id is required");
            }
            const workspace = await workSpaceRepository.addMembers({workspaceId, members, createdBy});
            if(!workspace){
                throw new NotFoundException("Workspace not found");
            }
            await activityServices.createActivity({workspaceId: workspace.workspaceId, type: "MembersAdded", actor: createdBy, payload: { title: "Members Added" }});
            return workspaceSchema.parse(workspace);
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }

    async removeMember(workspaceId: string, member: string, createdBy: string): Promise<void>{
        try {
            if(!workspaceId){
                throw new BadRequestException("Workspace id is required");
            }
            await workSpaceRepository.removeMembers({workspaceId, member, createdBy});
            
            await activityServices.createActivity({workspaceId, type: "MemberRemoved", actor: createdBy, payload: { title: "Member Removed" }});
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }

    async updateWorkspaceOwner(workspaceId: string, createdBy: string, newOwner: string): Promise<void>{
        try {
            if(!workspaceId){
                throw new BadRequestException("Workspace id is required");
            }
            await workSpaceRepository.updateWorkspaceOwner({workspaceId, createdBy, newOwner});

            await activityServices.createActivity({workspaceId, type: "OwnerTransferred", actor: createdBy, payload: { title: "Owner Transferred" }});
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }

    async deleteWorkspace(workspaceId: string, createdBy: string): Promise<boolean>{
        try {
            const deleted = await workSpaceRepository.deleteWorkspace({workspaceId, createdBy});
            if(!deleted){
                throw new BadRequestException("not able to delete workspace");
            }
            await activityServices.createActivity({workspaceId: workspaceId, type: "WorkspaceDeleted", actor: createdBy, payload: { title: "Workspace Deleted" }});
            return deleted;
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }
}

export const workSpaceServices = new WorkSpaceServices();