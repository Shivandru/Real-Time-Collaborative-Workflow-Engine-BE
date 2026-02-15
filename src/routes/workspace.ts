import AppRouter from "./AppRouter.ts";
import { createValidator } from "../middlewares/validator.ts";
import { HttpStatusCodes } from "../utils/enums/http.ts";
import { createWorkspaceSchema } from "../schemas/workspace.ts";
import { workSpaceServices } from "../services/workspace.ts";
import { authMiddleware } from "../middlewares/auth.ts";
// import type { JwtPayload } from "../schemas/jwt.ts";

const router = new AppRouter();
const validator = createValidator();

router.post("/create", authMiddleware, validator.body(createWorkspaceSchema), async(req, res, next) => {
    try {
        const { title, createdBy } = req.body;
        const workspace = await workSpaceServices.createWorkspace({ title, createdBy });
        res.status(HttpStatusCodes.Success.CREATED).send({
            success: true,
            data: workspace
        })
    } catch (error) {
        next(error);
    }
})

router.get("/getAll", authMiddleware, async(_req, res, next) => {
    try {
        const workspaces = await workSpaceServices.getAllWorkspaces();
        res.status(HttpStatusCodes.Success.OK).send({
            success: true,
            data: workspaces
        })
    } catch (error) {
        next(error);
    }
})

export default router;