import { Router } from "express";
import {
  createUserHandler,
  getCurrentUserHandler,
} from "@controller/userController";
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
