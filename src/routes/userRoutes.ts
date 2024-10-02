import { Router } from "express";
import validateResource from "@/middleware/validateResource";
import { createUserSchema } from "@/schema/userSchema";
import { createUserHandler } from "@/controller/userController";

const userRouter = Router();

userRouter.post(
  "/users",
  validateResource(createUserSchema),
  createUserHandler
);

export default userRouter;
