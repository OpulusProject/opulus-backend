import bodyParser from "body-parser";
import express, { Router } from "express";

import { verifyWebhook } from "@middleware/verifyWebhook";
import { handleWebook } from "src/webhook/handleWebhook";

const WEBHOOK_PORT = process.env.WEBHOOK_PORT || 8081;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = Router();
router.post("/webhook", verifyWebhook, handleWebook);

app.use(router);

app.listen(WEBHOOK_PORT, () => {
  console.log(
    `Webhook receiver is up and running at http://localhost:${WEBHOOK_PORT}`,
  );
});
