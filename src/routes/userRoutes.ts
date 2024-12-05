import { Router } from "express";

import { createUserHandler } from "@controllers/user/createUserHandler";
import { getCurrentUserHandler } from "@controllers/user/getCurrentUserHandler";
import requireUser from "@middleware/requireUser";
import validateResource from "@middleware/validateResource";
import { createUserSchema } from "@schema/userSchema";

const userRouter = Router();

userRouter.post(
  "/users",
  validateResource(createUserSchema),
  createUserHandler,
);

userRouter.get("/users/me", requireUser, getCurrentUserHandler);

export default userRouter;
