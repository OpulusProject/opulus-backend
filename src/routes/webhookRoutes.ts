import { Router } from "express";

import { handleWebook } from "@controllers/webhook/handleWebhook";

const webhookRouter = Router();

webhookRouter.post("/webhook", handleWebook);

export default webhookRouter;
