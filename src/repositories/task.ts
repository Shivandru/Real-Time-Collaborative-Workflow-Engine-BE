import { taskSchema, type CreateTask, type Task, type TaskDocument, type UpdateTask } from "../schemas/task.ts";
import { InternalServerErrorException } from "../utils/exceptions/server.ts";
import {v4 as uuid} from "uuid";
import MongoConnection from "../config/db.ts";

class TaskRepository {

    private get collection() {
        return MongoConnection.getInstance().getDb().collection<Task>("tasks");
    }
    async createTask({title, description, members, boardId, listId, workspaceId, createdBy}: CreateTask): Promise<Task> {
        try {
            const newTask = {
                title,
                description,
                members,
                boardId,
                listId,
                workspaceId,
                taskId: `t-${uuid()}`,
                createdAt: new Date().toISOString(),
                createdBy
            }
            await this.collection.insertOne(newTask);
            return newTask;
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

    async getTask(taskId: string): Promise<TaskDocument | null> {
        try {
            const task = await this.collection.findOne({ taskId });
            return task ? task : null;
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

    async updateTask({ taskId, title, description, members, boardId, listId, workspaceId }: UpdateTask): Promise<TaskDocument | null> {
        try {
            const updateQuery: any = {};
            if(title){
                updateQuery.$set = { title };
            }
            if(description){
                updateQuery.$set = { description };
            }
            if(members && members.length > 0){
                updateQuery.$addToSet = {
                    members: { $each: members }
                }
            }
            if(listId){
                updateQuery.$set = { listId };
            }
            const updated = await this.collection.findOneAndUpdate({ taskId, boardId, workspaceId }, updateQuery, {
                returnDocument: "after",
                projection: { _id: 0 }
            });
            return updated ? updated : null;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }
}

export const taskRepository = new TaskRepository();