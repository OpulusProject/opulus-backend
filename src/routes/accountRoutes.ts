import { Router } from "express";

import {
  createAccountsHandler,
  getAccountsHandler,
} from "@controller/accountController";
import requireUser from "@middleware/requireUser";

const accountRouter = Router();

accountRouter.post("/accounts", requireUser, createAccountsHandler);

accountRouter.get("/accounts", requireUser, getAccountsHandler);

export default accountRouter;
