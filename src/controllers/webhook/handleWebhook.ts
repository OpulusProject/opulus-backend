import { Request, Response } from "express";

import { WebhookInput } from "@schema/webhookSchema";

import { handleTransactionsWebhook } from "./handleTransactionsWebhook";
import { unhandledWebhook } from "./unhandledWebhook";

export async function handleWebook(
  req: Request<object, object, WebhookInput>,
  res: Response,
) {
  const { webhook_type: webhookType } = req.body;

  // todo: add the verify webhook service call here

  switch (webhookType) {
    case "transactions": {
      await handleTransactionsWebhook(req, res);
      break;
    }
    default: {
      unhandledWebhook(req, res);
    }
  }
}
