import { type BaseTaskIdentifiers, type RenameTask, type Task, type UpdateDescriptionTask, type UpdateLabelsTask, type UpdateMembersTask } from "../schemas/task.ts";
import { InternalServerErrorException } from "../utils/exceptions/server.ts";

import MongoConnection from "../config/db.ts";
import { NotFoundException } from "../utils/exceptions/client.ts";

class TaskRepository {

    private get collection() {
        return MongoConnection.getInstance().getDb().collection<Task>("tasks");
    }
    async createTask(task: Task): Promise<Task> {
        try {
            await this.collection.insertOne(task);
            return task;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async getTasks(workspaceId: string, boardId: string): Promise<Task[]> {
        try {
            const tasks = await this.collection.find({ workspaceId, boardId }).toArray();
            return tasks;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async getTask(taskId: string): Promise<Task | null> {
        try {
            const task = await this.collection.findOne({ taskId });
            if(!task){
                return null;
            }
            const { _id, ...rest } = task;
            return rest;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async deleteTask(taskId: string): Promise<boolean> {
        try {
            const result = await this.collection.findOneAndDelete({ taskId });
            return !!result;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async renameTask({ taskId, workspaceId, boardId, boardListId, title }: Omit<RenameTask, "createdBy">): Promise<void> {
        try {
            await this.collection.updateOne({
                taskId,
                workspaceId,
                boardId,
                boardListId
            }, {
                $set: {
                    title
                }
            })
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }
    async updateDescription({ taskId, workspaceId, boardId, boardListId, description }: Omit<UpdateDescriptionTask, "createdBy">): Promise<void> {
        try {
            await this.collection.updateOne({
                taskId,
                workspaceId,
                boardId,
                boardListId
            }, {
                $set: {
                    description
                }
            })
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }

    async updateMembers({taskId, workspaceId, boardId, boardListId, members}: Omit<UpdateMembersTask, "createdBy">): Promise<void>{
        try {
            const result = await this.collection.updateOne({
                taskId,
                workspaceId,
                boardId,
                boardListId,
            }, {
                $addToSet: {
                    members: { $each: members }
                }
            });
            if (result.matchedCount === 0) {
                throw new NotFoundException("Task not found");
            }
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }

    async updateListId({ taskId, workspaceId, boardId, boardListId }: Omit<BaseTaskIdentifiers, "createdBy">): Promise<void>{
        try {
            const result = await this.collection.updateOne({
                taskId,
                workspaceId,
                boardId,
            }, {
                $set: {
                    boardListId
                }
            })
            if (result.matchedCount === 0) {
                throw new NotFoundException("Task not found");
            }
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }

    async updateLabels({ taskId, workspaceId, boardId, boardListId, labels }: Omit<UpdateLabelsTask, "createdBy">): Promise<void>{
        try {
            const result = await this.collection.updateOne({
                taskId,
                workspaceId,
                boardId,
                boardListId,
            }, {
                $addToSet: {
                    labels: { $each: labels }
                }
            });
            if (result.matchedCount === 0) {
                throw new NotFoundException("Task not found");
            }
        } catch (error) {
            throw new InternalServerErrorException(error instanceof Error ? error.message: "Internal Server Error");
        }
    }
}

export const taskRepository = new TaskRepository();