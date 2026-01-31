import { taskRepository } from "../repositories/task.ts";
import { taskSchema, type CreateTask, type Task, type UpdateTask } from "../schemas/task.ts";
import { InternalServerErrorException } from "../utils/exceptions/server.ts";

class TaskServices {
    async createTask({title, description, members, boardId, listId, workspaceId, createdBy}: CreateTask): Promise<Task> {
        try {
            const task = await taskRepository.createTask({title, description, members, boardId, listId, workspaceId, createdBy});
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
            const { _id, ...rest } = task;
            return task ? taskSchema.parse(rest) : null;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async deleteTask(taskId: string): Promise<boolean> {
        try {
            const deleted = await taskRepository.deleteTask(taskId);
            return deleted;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }

    async updateTask({ taskId, title, description, members, boardId, listId, workspaceId }: UpdateTask): Promise<Task | null> {
        try {
            const task = await taskRepository.updateTask({ taskId, title, description, members, boardId, listId, workspaceId });
            if(!task){
                return null;
            }
            const { _id, ...rest } = task;
            return task ? taskSchema.parse(rest) : null;
        } catch (error) {
            throw new InternalServerErrorException("Internal Server Error");
        }
    }
}

export const taskServices = new TaskServices();