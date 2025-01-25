import { Request, Response } from "express";
import { ItemWebhookUpdateRequest } from "plaid";

export function handleTransactionsWebhook(req: Request, res: Response) {
  const { webhookCode, plaidItemId } = req.body;

  console.log(
    `WEBHOOK: TRANSACTIONS: ${webhookCode}: Plaid_item_id ${plaidItemId}`,
  );

  switch (webhookCode) {
    case "SYNC_UPDATES_AVAILABLE":
        // Fired when new transactions data becomes available.
        const {
            addedCount,
            modifiedCount,
            removedCount,
        } = await updateTransactions(plaidItemId);
        const { id: itemId } = await retrieveItemByPlaidItemId(plaidItemId);
        console.log(
            `Transactions: ${addedCount} added, ${modifiedCount} modified, ${removedCount} removed, ${itemId: ${plaidItemId}}`,
        );
  }
}
