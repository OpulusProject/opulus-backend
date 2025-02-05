import { Request, Response } from "express";
import { WebhookType } from "plaid/dist/api";

import { WebhookInput } from "@schema/webhookSchema";

import { handleTransactionsWebhook } from "./handleTransactionsWebhook";
import { unhandledWebhook } from "./unhandledWebhook";

// This handler is the main handler for all webhooks.
// It will call the appropriate handler. Otherwise, it will call the unhandledWebhook handler.
export async function handleWebook(
  req: Request<object, object, WebhookInput>,
  res: Response,
) {
  const { webhook_type: webhookType } = req.body;

  switch (webhookType) {
    case WebhookType.Transactions.toString(): {
      await handleTransactionsWebhook(req, res);
      break;
    }
    default: {
      unhandledWebhook(req, res);
    }
  }
}
