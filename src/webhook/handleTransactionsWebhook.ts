import { Request, Response } from "express";

import { syncTransactionsHandler } from "@controllers/transaction/syncTransactionsHandler";
import { WebhookInput } from "@schema/webhookSchema";

export async function handleTransactionsWebhook(
  req: Request<object, object, WebhookInput>,
  res: Response,
) {
  const { webhook_code: webhookCode, item_id: plaidItemId } = req.body;

  console.log(`[TRANSACTIONS WEBHOOK] ${webhookCode} - ${plaidItemId}`);

  switch (webhookCode) {
    case "SYNC_UPDATES_AVAILABLE": {
      await syncTransactionsHandler(req, res);
    }
  }
}
