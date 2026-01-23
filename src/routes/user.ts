import { userservices } from "../services/user.ts";
import { createValidator } from "../middlewares/validator.ts";
import { createUserSchema } from "../schemas/user.ts";
import AppRouter from "./AppRouter.ts";
import { HttpStatusCodes } from "../utils/enums/http.ts";

const router = new AppRouter();
const validator = createValidator();

router.post("/signup", validator.body(createUserSchema), async(req, res, next)=>{
    try {
        const { username, email, auth} = req.body;
        const { password } = auth;
        const user = await userservices.signUpwithLocal({ username, email, password });
        res.status(HttpStatusCodes.Success.CREATED).send({
            success: true,
            data: user
        })
    } catch (error) {
        next(error);
    }
})

export default router;