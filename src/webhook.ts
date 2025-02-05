import bodyParser from "body-parser";
import express, { Router } from "express";

import { handleWebook } from "@controllers/webhook/handleWebhook";
import logResponse from "@middleware/logResponse";
import { verifyWebhook } from "@middleware/verifyWebhook";

const WEBHOOK_PORT = process.env.WEBHOOK_PORT || 8081;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logResponse);

const router = Router();
router.post("/webhook", verifyWebhook, handleWebook);

app.use(router);

app.listen(WEBHOOK_PORT, () => {
  console.log(
    `Webhook receiver is up and running at http://localhost:${WEBHOOK_PORT}`,
  );
});
