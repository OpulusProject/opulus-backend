import { Request, Response } from "express";

import { WebhookInput } from "@schema/webhookSchema";

export function unhandledWebhook(
  req: Request<object, object, WebhookInput>,
  res: Response,
) {
  const {
    webhook_type: webhookType,
    webhook_code: webhookCode,
    item_id: plaidItemId,
  } = req.body;

  console.log(
    `UNHANDLED ${webhookType} WEBHOOK: ${webhookCode}: Plaid item id ${plaidItemId}`,
  );

  res.status(400).json({ message: "Unhandled webhook type" });
}
