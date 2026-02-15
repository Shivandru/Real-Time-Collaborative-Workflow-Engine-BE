import AppRouter from "./AppRouter.ts";
import { createValidator } from "../middlewares/validator.ts";
import { authMiddleware } from "../middlewares/auth.ts";
import { HttpStatusCodes } from "../utils/enums/http.ts";
import { boardServices } from "../services/board.ts";
import { createBoardSchema } from "../schemas/board.ts";

const router = new AppRouter();
const validator = createValidator();

router.post("/create", authMiddleware, validator.body(createBoardSchema), async (req, res, next) => {
    try {
        const { title, workspaceId, visibility, createdBy } = req.body;
        const board = await boardServices.createBoard({ title, workspaceId, visibility, createdBy });
        res.status(HttpStatusCodes.Success.CREATED).send({
            success: true,
            data: board
        })
    } catch (error) {
        next(error);
    }
})

router.get("/:workspaceId/getAll", authMiddleware, async(req, res, next) => {
    try {
        const { workspaceId } = req.params as { workspaceId: string };
        const boards = await boardServices.getBoards(workspaceId);
        res.status(HttpStatusCodes.Success.OK).send({
            success: true,
            data: boards
        })
    } catch (error) {
        next(error);
    }
})

router.get("/:workspaceId/get", authMiddleware, async (req, res, next) => {
    try {
        const { workspaceId } = req.params as { workspaceId: string };
        const { boardId } = req.query as { boardId: string };
        const board = await boardServices.getBoard(workspaceId, boardId);
        res.status(HttpStatusCodes.Success.OK).send({
            success: true,
            data: board
        })
    } catch (error) {
        next(error);
    }
})

export default router;