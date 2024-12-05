import { Router } from "express";

import { createAccountsHandler } from "@controllers/account/createAccountsHandler";
import { getAccountsHandler } from "@controllers/account/getAccountsHandler";
import requireUser from "@middleware/requireUser";

const accountRouter = Router();

accountRouter.post("/accounts", requireUser, createAccountsHandler);

accountRouter.get("/accounts", requireUser, getAccountsHandler);

export default accountRouter;
