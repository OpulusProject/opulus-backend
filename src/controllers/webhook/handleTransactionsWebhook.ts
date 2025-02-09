import { Request, Response } from "express";

import { WebhookInput } from "@schema/webhookSchema";
import { getItem } from "@services/item/getItem";
import { transactionsSync } from "@services/plaid/transactionsSync";
import { createTransaction } from "@services/transaction/createTransaction";
import { deleteTransaction } from "@services/transaction/deleteTransaction";
import { normalizeTransaction } from "@services/transaction/normalizeTransaction";
import { updateTransaction } from "@services/transaction/updateTransaction";

export async function handleTransactionsWebhook(
  req: Request<object, object, WebhookInput>,
  res: Response,
) {
  const { webhook_code: webhookCode, item_id: plaidItemId } = req.body;

  console.log(
    `TRANSACTIONS WEBHOOK: ${webhookCode}: Plaid_item_id ${plaidItemId}`,
  );

  const item = await getItem({ plaidItemId });

  // Note: this error should typically never fire, because if the item doesn't exist in our database, it shouldn't exist in Plaid's database.
  // We need to call /item/remove to remove items from Plaid, and their related webhooks from firing.
  if (!item) {
    console.error("Item not found");
    res.status(404).json({
      message: "Item not found",
    });
    return;
  }

  switch (webhookCode) {
    case "SYNC_UPDATES_AVAILABLE": {
      // Fired when new transactions data becomes available.
      const transactionsSyncReponse = await transactionsSync(item.accessToken);
      const { added, modified, removed } = transactionsSyncReponse.data;

      // Create transactions
      for (const transaction of added) {
        await createTransaction(normalizeTransaction(transaction));
      }

      // Update transactions
      for (const transaction of modified) {
        await updateTransaction(normalizeTransaction(transaction));
      }

      // Delete transactions
      for (const transaction of removed) {
        await deleteTransaction(transaction.transaction_id);
      }

      console.log(
        `Transactions: ${added.length} added, ${modified.length} modified, ${removed.length} removed - ${plaidItemId}`,
      );
    }
  }
}
