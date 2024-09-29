import { Express, Router } from "express";
import validateResource from "../middleware/validateResource";
import { createUserSchema } from "../schema/userSchema";

const userRouter: Router = Router();

userRouter.post(
    "/api/users",
)