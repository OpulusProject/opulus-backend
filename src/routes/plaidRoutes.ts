import { Router } from "express";

import requireUser from "@middleware/requireUser";
import { createLinkTokenHandler } from "src/controllers/plaid/createLinkTokenHandler";

const plaidRouter = Router();

plaidRouter.post("/plaid/link-token", requireUser, createLinkTokenHandler);

export default plaidRouter;
