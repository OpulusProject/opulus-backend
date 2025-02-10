import { Request, Response } from "express";

import { createItemHandler } from "@controllers/item/createItemHandler";
import { WebhookInput } from "@schema/webhookSchema";

export async function handleLinkWebhook(
  req: Request<object, object, WebhookInput>,
  res: Response,
) {
  const { webhook_code: webhookCode, link_session_id: linkSessionId } =
    req.body;

  console.log(`LINK WEBHOOK: ${webhookCode}: link_session_id ${linkSessionId}`);

  switch (webhookCode) {
    case "ITEM_ADD_RESULT": {
      await createItemHandler(req, res);
      break;
    }
  }
}
