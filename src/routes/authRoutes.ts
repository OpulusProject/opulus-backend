import { Router } from "express";
import validateResource from "@middleware/validateResource";
import {
  createSessionHandler,
  invalidateSessionHandler,
  refreshAccessTokenHandler,
} from "@controller/authController";
import { createSessionSchema } from "@schema/authSchema";
import requireUser from "@middleware/requireUser";

const authRouter = Router();

authRouter.post(
  "/sessions",
  validateResource(createSessionSchema),
  createSessionHandler
);

authRouter.post("/sessions/invalidate", invalidateSessionHandler);

authRouter.post("/sessions/refresh", requireUser, refreshAccessTokenHandler);

export default authRouter;
