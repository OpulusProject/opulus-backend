import { Request, Response } from "express";
import { WebhookType } from "plaid/dist/api";

import { WebhookInput } from "@schema/webhookSchema";

import { handleTransactionsWebhook } from "./handleTransactionsWebhook";
import { unhandledWebhook } from "./unhandledWebhook";

export async function handleWebook(
  req: Request<object, object, WebhookInput>,
  res: Response,
) {
  const { webhook_type: webhookType } = req.body;

  // todo: add the verify webhook service call here
  // todo: log when a webhook is received

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
