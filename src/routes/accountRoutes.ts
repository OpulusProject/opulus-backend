import { Router } from "express";

import { getAccountsHandler } from "@controllers/account/getAccountsHandler";
import requireUser from "@middleware/requireUser";

const accountRouter = Router();

accountRouter.get("/accounts", requireUser, getAccountsHandler);

export default accountRouter;
