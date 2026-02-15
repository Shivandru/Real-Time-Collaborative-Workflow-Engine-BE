import { userservices } from "../services/user.ts";
import { createUserSchema } from "../schemas/user.ts";
import AppRouter from "./AppRouter.ts";
import { createValidator } from "../middlewares/validator.ts";
import { HttpStatusCodes } from "../utils/enums/http.ts";

const router = new AppRouter();
const validator = createValidator();

router.post("/signup", validator.body(createUserSchema), async (req, res, next) => {
    try {
        const { username, email } = req.body;
        const { user, token } = await userservices.signUpLogin({ username, email });
        res.status(HttpStatusCodes.Success.CREATED).send({
            success: true,
            data: { user, token },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
