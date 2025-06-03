import { Router } from "express";

import { getAccountsHandler } from "@controllers/account/getAccountsHandler";
import { getBalanceHistoryHandler } from "@controllers/account/getBalanceHistoryHandler";
import requireUser from "@middleware/requireUser";

const accountRouter = Router();

accountRouter.get("/accounts", requireUser, getAccountsHandler);
accountRouter.get(
  "/accounts/balance-history",
  requireUser,
  getBalanceHistoryHandler,
);

export default accountRouter;
