import { taskRepository } from "../repositories/task.ts";
import { taskSchema, type BaseTaskIdentifiers, type CreateTask, type RenameTask, type Task, type UpdateDescriptionTask, type UpdateLabelsTask, type UpdateMembersTask } from "../schemas/task.ts";
import { InternalServerErrorException } from "../utils/exceptions/server.ts";
import { v4 as uuid } from "uuid";
import { workSpaceServices } from "./workspace.ts";
import { BadRequestException, UnauthorizedException } from "../utils/exceptions/client.ts";

class TaskServices {
    async createTask({ title, description, members, boardId, boardListId, workspaceId, createdBy, labels }: CreateTask): Promise<Task> {
        const isEligible = await workSpaceServices.authorizeMembers(workspaceId, createdBy);
        if(!isEligible){
            throw new UnauthorizedException("You are not authorized to create a task");
        }
        try {
            const newTask = {
                taskId: `t-${uuid()}`,
                title,
                description,
                members,
                boardId,
                boardListId,
                workspaceId,
                createdBy,
                labels,
                createdAt: new Date().toISOString(),
            }
            const task = await taskRepository.createTask(newTask);
            return taskSchema.parse(task);
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async getTasks(workspaceId: string, boardId: string): Promise<Task[]> {
        try {
            const tasks = await taskRepository.getTasks(workspaceId, boardId);
            return taskSchema.array().parse(tasks);
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async getTask(taskId: string): Promise<Task | null> {
        try {
            const task = await taskRepository.getTask(taskId);
            if(!task){
                return null;
            }
            return task ? taskSchema.parse(task) : null;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async deleteTask(taskId: string, workspaceId: string, createdBy: string): Promise<boolean> {
        try {
            const isEligible = await workSpaceServices.authorizeMembers(workspaceId, createdBy);
            if(!isEligible){
                throw new UnauthorizedException("You are not authorized to delete this task");
            }
            const deleted = await taskRepository.deleteTask(taskId);
            return deleted;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async renameTask({taskId, workspaceId, boardId, boardListId, title, createdBy}:RenameTask):Promise<void>{
        if(!createdBy){
            throw new BadRequestException("missing required fields");
        }
        try {
            const isEligible = await workSpaceServices.authorizeMembers(workspaceId, createdBy);
            if(!isEligible){
                throw new UnauthorizedException("You are not authorized to rename this task");
            }
            await taskRepository.renameTask({taskId, workspaceId, boardId, boardListId, title});
        } catch (error) {
            throw new InternalServerErrorException(String(error));
        }
    }

    async updateDescription({taskId, workspaceId, boardId, boardListId, description, createdBy}: UpdateDescriptionTask): Promise<void>{
        try {
           if(!createdBy){
                throw new BadRequestException("missing required fields");
            }
            const isEligible = await workSpaceServices.authorizeMembers(workspaceId, createdBy);
            if(!isEligible){
                throw new UnauthorizedException("You are not authorized to update this task");
            }
            await taskRepository.updateDescription({taskId, workspaceId, boardId, boardListId, description});
        } catch (error) {
            throw new InternalServerErrorException(String(error));
        }
    }

    async updateMembers({taskId, workspaceId, boardId, boardListId, members, createdBy}: UpdateMembersTask): Promise<void>{
        try {
            if(!createdBy){
                throw new BadRequestException("missing required fields");
            }
            const isEligible = await workSpaceServices.authorizeMembers(workspaceId, createdBy);
            if(!isEligible){
                throw new UnauthorizedException("You are not authorized to update this task");
            }
            await taskRepository.updateMembers({taskId, workspaceId, boardId, boardListId, members});
        } catch (error) {
            throw new InternalServerErrorException(String(error));
        }
    }

    async updateListId({ taskId, workspaceId, boardId, boardListId, createdBy }: BaseTaskIdentifiers): Promise<void>{
        try {
            if(!createdBy){
                throw new BadRequestException("missing required fields");
            }
            const isEligible = await workSpaceServices.authorizeMembers(workspaceId, createdBy);
            if(!isEligible){
                throw new UnauthorizedException("You are not authorized to update this task");
            }
            await taskRepository.updateListId({ taskId, workspaceId, boardId, boardListId });
        } catch (error) {
            throw new InternalServerErrorException(String(error));
        }
    }

    async updateLabels({ taskId, workspaceId, boardId, boardListId, labels, createdBy }: UpdateLabelsTask): Promise<void>{
        try {
            if(!createdBy){
                throw new BadRequestException("missing required fields");
            }
            const isEligible = await workSpaceServices.authorizeMembers(workspaceId, createdBy);
            if(!isEligible){
                throw new UnauthorizedException("You are not authorized to update this task");
            }
            await taskRepository.updateLabels({ taskId, workspaceId, boardId, boardListId, labels });
        } catch (error) {
            throw new InternalServerErrorException(String(error));
        }
    }
}

export const taskServices = new TaskServices();