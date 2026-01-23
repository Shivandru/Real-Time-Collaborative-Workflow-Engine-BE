import { HttpStatusCodes } from "../utils/enums/http.ts";
import AppRouter from "./AppRouter.ts";
import userRouter from "./user.ts";

const router = new AppRouter();

router.get("/", (_req, res, next)=>{
    try {
        res.status(HttpStatusCodes.Success.OK).send("Welcome to real time collaborative engine")
    } catch (error) {
        next(error)
    }
})

router.use("/user", userRouter);

export default router;