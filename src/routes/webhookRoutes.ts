import { Router } from "express";

import { handleWebook } from "@controllers/webhook/handleWebhook";

const router = Router();

router.post("/webhook", handleWebook);

export default router;
