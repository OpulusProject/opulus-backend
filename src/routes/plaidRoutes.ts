import { Router } from "express";
import { createLinkTokenHandler } from "@controller/plaidController";
import requireUser from "@middleware/requireUser";

const plaidRouter = Router();

plaidRouter.post("/plaid/link-token", requireUser, createLinkTokenHandler);

export default plaidRouter;
