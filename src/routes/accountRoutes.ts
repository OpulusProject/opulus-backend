import { createAccountsHandler } from "@controller/accountController";
import requireUser from "@middleware/requireUser";
import { Router } from "express";

const accountRouter = Router ();

accountRouter.post(
    "/accounts", requireUser, createAccountsHandler
);

export default accountRouter;