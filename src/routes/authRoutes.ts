import { Router } from "express";

import { createSessionHandler } from "@controllers/auth/createSessionHandler";
import { googleOAuthHandler } from "@controllers/auth/googleOAuthHandler";
import { invalidateSessionHandler } from "@controllers/auth/invalidateSessionHandler";
import { refreshAccessTokenHandler } from "@controllers/auth/refreshSessionHandler";
import validateResource from "@middleware/validateResource";
import { createSessionSchema } from "@schema/authSchema";

const authRouter = Router();

authRouter.get("/sessions/oauth/google", googleOAuthHandler);

authRouter.post(
  "/sessions",
  validateResource(createSessionSchema),
  createSessionHandler,
);

authRouter.post("/sessions/invalidate", invalidateSessionHandler);

authRouter.post("/sessions/refresh", refreshAccessTokenHandler);

export default authRouter;
