import AppRouter from "./AppRouter.ts";
import { createValidator } from "../middlewares/validator.ts";
import { baseTaskIdentifiers, createTaskSchema, renameTaskSchema, updateDescriptionTaskSchema, updateLabelsSchema, updateMembersSchema, type BaseTaskIdentifiers, type RenameTask, type UpdateDescriptionTask, type UpdateLabelsTask, type UpdateMembersTask } from "../schemas/task.ts";
import { authMiddleware } from "../middlewares/auth.ts";
import { taskServices } from "../services/task.ts";
import { HttpStatusCodes } from "../utils/enums/http.ts";

const router = new AppRouter();
const validator = createValidator();

router.post("/create", authMiddleware, validator.body(createTaskSchema), async (req, res, next)=>{
    try {
        const { title, description, members, boardId, boardListId, workspaceId, createdBy, labels } = req.body;
        const task = await taskServices.createTask({ title, description, members, boardId, boardListId, workspaceId, createdBy, labels });
        res.status(HttpStatusCodes.Success.CREATED).send({
            success: true,
            data: task
        })
    } catch (error) {
        next(error);
    }
})

router.get("/getAll", authMiddleware, async (req, res, next)=>{
    try {
        const { workspaceId, boardId } = req.query as {workspaceId: string, boardId: string, boardListId: string};
        const tasks = await taskServices.getTasks(workspaceId, boardId);
        res.status(HttpStatusCodes.Success.OK).send({
            success: true,
            data: tasks
        })
    } catch (error) {
        next(error);
    }
})

router.get("/:taskId", authMiddleware, async (req, res, next)=>{
    try {
        const { taskId } = req.params as {taskId: string};
        const task = await taskServices.getTask(taskId);
        res.status(HttpStatusCodes.Success.OK).send({
            success: true,
            data: task
        })
    } catch (error) {
        next(error);
    }
})

router.delete("/delete", authMiddleware, async (req, res, next)=>{
    try {
        const {taskId, workspaceId, createBy} = req.body as {taskId: string, workspaceId: string, createBy: string};
        const task = await taskServices.deleteTask(taskId, workspaceId, createBy);
        res.status(HttpStatusCodes.Success.OK).send({
            success: task,
        })
    } catch (error) {
        next(error);
    }
})

router.patch("/rename", authMiddleware, validator.body(renameTaskSchema), async (req, res, next)=>{
    try {
        const { taskId, workspaceId, boardId, boardListId, title, createdBy } = req.body as RenameTask;
        await taskServices.renameTask({taskId, workspaceId, boardId, boardListId, title, createdBy});
        res.status(HttpStatusCodes.Success.OK).send({
            success: true,
        })
    } catch (error) {
        next(error);
    }
})

router.patch("/description", validator.body(updateDescriptionTaskSchema), authMiddleware, async (req, res, next)=>{
    try {
        const { taskId, workspaceId, boardId, boardListId, description, createdBy } = req.body as UpdateDescriptionTask;
        await taskServices.updateDescription({taskId, workspaceId, boardId, boardListId, description, createdBy});
        res.status(HttpStatusCodes.Success.OK).send({
            success: true,
        })
    } catch (error) {
        next(error);
        
    }
})

router.patch("/members", authMiddleware, validator.body(updateMembersSchema), async (req, res, next)=>{
    try {
        const {taskId, workspaceId, boardId, boardListId, members, createdBy} = req.body as UpdateMembersTask;
        await taskServices.updateMembers({taskId, workspaceId, boardId, boardListId, members, createdBy});
        res.status(HttpStatusCodes.Success.OK).send({
            success: true
        })
    } catch (error) {
        next(error);
    }
})

router.patch("/updateList", authMiddleware, validator.body(baseTaskIdentifiers), async(req, res, next) => {
    try {
        const { taskId, workspaceId, boardId, boardListId, createdBy } = req.body as BaseTaskIdentifiers;
        await taskServices.updateListId({ taskId, workspaceId, boardId, boardListId, createdBy });
        res.status(HttpStatusCodes.Success.OK).send({
            success: true
        })
    } catch (error) {
        next(error);
    }
})

router.patch("/updateLabels", authMiddleware, validator.body(updateLabelsSchema), async(req, res, next) => {
    try {
        const { taskId, workspaceId, boardId, boardListId, labels, createdBy } = req.body as UpdateLabelsTask;
        await taskServices.updateLabels({ taskId, workspaceId, boardId, boardListId, labels, createdBy });
        res.status(HttpStatusCodes.Success.OK).send({
            success: true
        })
    } catch (error) {
        next(error);
    }
})



export default router;