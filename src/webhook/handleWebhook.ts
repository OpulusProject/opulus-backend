import { Request, Response } from "express";

import { WebhookInput } from "@schema/webhookSchema";

import { handleLinkWebhook } from "./handleLinkWebhook";
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
    case "LINK": {
      await handleLinkWebhook(req, res);
      break;
    }
    case "TRANSACTIONS": {
      await handleTransactionsWebhook(req, res);
      break;
    }
    default: {
      unhandledWebhook(req, res);
    }
  }
}
