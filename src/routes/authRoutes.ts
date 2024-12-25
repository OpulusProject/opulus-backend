import { Router } from "express";

import { createSessionHandler } from "@controllers/auth/createSessionHandler";
import { googleOAuthHandler } from "@controllers/auth/googleOAuthHandler";
import { logoutHandler } from "@controllers/auth/logoutHandler";
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

authRouter.post("/auth/logout", logoutHandler);

authRouter.post("/sessions/refresh", refreshAccessTokenHandler);

export default authRouter;
