import { Router } from "express";

import { createAccountsHandler } from "@controller/accountController";
import requireUser from "@middleware/requireUser";

const accountRouter = Router();

accountRouter.post("/accounts", requireUser, createAccountsHandler);

export default accountRouter;
