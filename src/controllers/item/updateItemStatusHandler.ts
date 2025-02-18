import { ItemStatus } from "@prisma/client";
import { Request, Response } from "express";

import { WebhookInput } from "@schema/webhookSchema";
import { getItem } from "@src/services/item/getItem";
import { updateItem } from "@src/services/item/updateItem";

export async function updateItemStatusHandler(
  req: Request<object, object, WebhookInput>,
  res: Response,
) {
  const { webhook_code: webhookCode, item_id: plaidItemId } = req.body;
  const status = (
    webhookCode == "LOGIN_REPAIRED" ? "OK" : webhookCode
  ) as ItemStatus;

  try {
    const item = await getItem({ plaidItemId });

    if (!item) {
      res.status(404).json({
        message: "Item not found",
      });
      res.status(500).json({
        message: `Could not find item ${plaidItemId}`,
      });
      return;
    }

    const updatedItem = {
      ...item,
      status,
    };

    await updateItem(updatedItem);

    console.log(`[ITEM WEBHOOK] ${webhookCode} - ${plaidItemId}: Item updated`);

    res.status(200).json({
      message: "Item updated successfully",
    });
  } catch (error) {
    console.error("Unknown error updating item:", error);
    res.status(500).json({
      message: "Could not update item",
      error: (error as Error).message,
    });
  }
}
