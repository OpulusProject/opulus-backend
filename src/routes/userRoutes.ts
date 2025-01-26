import { Router } from "express";

import { createUserHandler } from "@controllers/user/createUserHandler";
import { getUserHandler } from "@controllers/user/getUserHandler";
import requireUser from "@middleware/requireUser";
import validateResource from "@middleware/validateResource";
import { createUserSchema } from "@schema/userSchema";

const userRouter = Router();

userRouter.post("/user", validateResource(createUserSchema), createUserHandler);

userRouter.get("/user", requireUser, getUserHandler);

export default userRouter;
