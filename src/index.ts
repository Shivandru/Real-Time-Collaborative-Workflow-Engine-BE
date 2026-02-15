import express from "express";
import cookieParser from "cookie-parser";
import MongoConnection from "./config/db.ts";
import { env } from "./config/env-validator.ts";
import setupCorsMiddleware from "./middlewares/cors-setup.ts";
import errorHandler from "./middlewares/errors.ts";
import router from "./routes/index.ts";

const app = express();
setupCorsMiddleware(app);
app.use(cookieParser());
app.use(express.json({ limit: "1024mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(router.valueOf());

app.use(errorHandler);

app.listen(env.PORT, async () =>{
    console.log(`Server running on port ${env.PORT}`);
    try {
        await MongoConnection.getInstance().connect();
    } catch (error) {
        throw new Error(`Error while connecting db`);
    }
});