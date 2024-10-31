import { Router } from "express";

import {
  createSessionHandler,
  invalidateSessionHandler,
  refreshAccessTokenHandler,
} from "@controller/authController";
import requireUser from "@middleware/requireUser";
import validateResource from "@middleware/validateResource";
import { createSessionSchema } from "@schema/authSchema";

const authRouter = Router();

authRouter.post(
  "/sessions",
  validateResource(createSessionSchema),
  createSessionHandler,
);

authRouter.post("/sessions/invalidate", invalidateSessionHandler);

authRouter.post("/sessions/refresh", requireUser, refreshAccessTokenHandler);

export default authRouter;
