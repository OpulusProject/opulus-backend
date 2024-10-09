import { Router } from "express";
import validateResource from "@middleware/validateResource";
import {
  createSessionHandler,
  refreshAccessTokenHandler,
} from "@controller/authController";
import { createSessionSchema } from "@schema/authSchema";

const authRouter = Router();

authRouter.post(
  "/sessions",
  validateResource(createSessionSchema),
  createSessionHandler
);

authRouter.post("/sessions/refresh", refreshAccessTokenHandler);

export default authRouter;
