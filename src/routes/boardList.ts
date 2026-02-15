import AppRouter from "./AppRouter.ts";
import { createValidator } from "../middlewares/validator.ts";
import { createboardListSchema, deleteBoardListSchema } from "../schemas/boardList.ts";
import { boardListServices } from "../services/boardList.ts";
import { HttpStatusCodes } from "../utils/enums/http.ts";
import { authMiddleware } from "../middlewares/auth.ts";

const router = new AppRouter();
const validator = createValidator();

router.post("/create", authMiddleware, validator.body(createboardListSchema), async (req, res, next) => {
    try {
        const { title, boardId, workspaceId, createdBy } = req.body;
        const boardList = await boardListServices.createBoardList({ title, boardId, workspaceId, createdBy });
        res.status(HttpStatusCodes.Success.CREATED).send({
            success: true,
            data: boardList,
        });
    } catch (error) {
        next(error);
    }
});

router.get("/getAll", authMiddleware, async (req, res, next) => {
    try {
        const { boardId, workspaceId } = req.query as { boardId: string, workspaceId: string };
        const boardLists = await boardListServices.getBoardLists(workspaceId, boardId);
        res.status(HttpStatusCodes.Success.OK).send({
            success: true,
            data: boardLists,
        });
    } catch (error) {
        next(error);
    }
});

router.delete("/delete", authMiddleware, validator.body(deleteBoardListSchema), async (req, res, next) => {
    try {
        const { boardListId, workspaceId, boardId } = req.body;

        const boardList = await boardListServices.deleteBoardList(boardListId, workspaceId, boardId, req.user?.email as string);
        res.status(HttpStatusCodes.Success.OK).send({
            success: true,
            data: boardList,
        });
    } catch (error) {
        next(error);
    }
})

export default router;
