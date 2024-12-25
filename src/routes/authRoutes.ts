import { Router } from "express";

import { loginHandler } from "@controllers/auth/createSessionHandler";
import { googleOAuthHandler } from "@controllers/auth/googleOAuthHandler";
import { logoutHandler } from "@controllers/auth/logoutHandler";
import { refreshAccessTokenHandler } from "@controllers/auth/refreshSessionHandler";
import validateResource from "@middleware/validateResource";
import { loginSchema } from "@schema/authSchema";

const authRouter = Router();

authRouter.get("/auth/oauth/google", googleOAuthHandler);

authRouter.post("/auth/login", validateResource(loginSchema), loginHandler);

authRouter.post("/auth/logout", logoutHandler);

authRouter.post("/auth/refresh", refreshAccessTokenHandler);

export default authRouter;
