import AppRouter from "./AppRouter.ts";
import { createValidator } from "../middlewares/validator.ts";
import { HttpStatusCodes } from "../utils/enums/http.ts";
import { createWorkspaceSchema } from "../schemas/workspace.ts";
import { workSpaceServices } from "../services/workspace.ts";

const router = new AppRouter();
const validator = createValidator();

router.post("/create", validator.body(createWorkspaceSchema), async(req, res, next) => {
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

export default router;