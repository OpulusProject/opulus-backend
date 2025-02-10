import { Request, Response } from "express";

import { WebhookInput } from "@schema/webhookSchema";
import { getItem } from "@services/item/getItem";
import { transactionsSync } from "@services/plaid/transactionsSync";
import { createTransaction } from "@services/transaction/createTransaction";
import { deleteTransaction } from "@services/transaction/deleteTransaction";
import { normalizeTransaction } from "@services/transaction/normalizeTransaction";
import { updateTransaction } from "@services/transaction/updateTransaction";

export async function syncTransactionsHandler(
  req: Request<object, object, WebhookInput>,
  res: Response,
) {
  const { webhook_code: webhookCode, item_id: plaidItemId } = req.body;

  try {
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

    // Fired when new transactions data becomes available.
    const transactionsSyncReponse = await transactionsSync(item.accessToken);
    const { added, modified, removed } = transactionsSyncReponse.data;

    // Create transactions
    for (const transaction of added) {
      try {
        await createTransaction(normalizeTransaction(transaction));
      } catch (transactionError) {
        console.error({
          message: `Failed to create transaction ${transaction.transaction_id}:`,
          transactionError,
        });
        continue;
      }
    }

    // Update transactions
    for (const transaction of modified) {
      try {
        await updateTransaction(normalizeTransaction(transaction));
      } catch (transactionError) {
        console.error({
          message: `Failed to update transaction ${transaction.transaction_id}:`,
          transactionError,
        });
        continue;
      }
    }

    // Delete transactions
    for (const transaction of removed) {
      try {
        await deleteTransaction(transaction.transaction_id);
      } catch (transactionError) {
        console.error({
          message: `Failed to delete transaction ${transaction.transaction_id}:`,
          transactionError,
        });
        continue;
      }
    }

    console.log(
      `${webhookCode} - ${plaidItemId}: ${added.length} added, ${modified.length} modified, ${removed.length} removed`,
    );
    res.status(200).json({
      message: "Transactions synced successfully",
    });
  } catch (error) {
    console.error("Unknown error syncing transactions:", error);
    res.status(500).json({
      message: "Could not sync transactions",
      error: (error as Error).message,
    });
  }
}
