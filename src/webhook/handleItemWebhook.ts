import { Request, Response } from "express";

import { WebhookInput } from "@schema/webhookSchema";
import { updateItemStatusHandler } from "@src/controllers/item/updateItemStatusHandler";

export async function handleItemWebhook(
  req: Request<object, object, WebhookInput>,
  res: Response,
) {
  const { webhook_code: webhookCode, item_id: plaidItemId } = req.body;

  console.log(`[ITEM WEBHOOK] ${webhookCode} - ${plaidItemId}`);

  switch (webhookCode) {
    case "ERROR":
    case "LOGIN_REPAIRED":
    case "NEW_ACCOUNTS_AVAILABLE":
    case "PENDING_DISCONNECT":
    case "PENDING_EXPIRATION":
    case "USER_PERMISSION_REVOKED": {
      await updateItemStatusHandler(req, res);
    }
  }
}
