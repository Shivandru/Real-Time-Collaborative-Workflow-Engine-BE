import { HttpStatusCodes } from "../utils/enums/http.ts";
import AppRouter from "./AppRouter.ts";
import userRouter from "./user.ts";
import workspaceRouter from "./workspace.ts"
import boardRouter from "./board.ts"
import boardListRouter from "./boardList.ts"
import taskRouter from "./tasks.ts"

const router = new AppRouter();

router.get("/", (_req, res, next) => {
    try {
        res.status(HttpStatusCodes.Success.OK).send("Welcome to real time collaborative engine")
    } catch (error) {
        next(error)
    }
})

router.use("/user", userRouter);
router.use("/workspace", workspaceRouter);
router.use("/boards", boardRouter);
router.use("/boardList", boardListRouter);
router.use("/tasks", taskRouter);

export default router;