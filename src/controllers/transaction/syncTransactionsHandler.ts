import { Request, Response } from "express";

import { WebhookInput } from "@schema/webhookSchema";
import { getItem } from "@services/item/getItem";
import { transactionsSync } from "@services/plaid/transactionsSync";
import { createTransactions } from "@src/services/transaction/createTransactions";
import { deleteTransactions } from "@src/services/transaction/deleteTransactions";
import { updateTransactions } from "@src/services/transaction/updateTransactions";
import { normalizeTransaction } from "src/types/Transaction/normalizeTransaction";

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
    const addedTransactions = added.map((plaidTransaction) =>
      normalizeTransaction(plaidTransaction),
    );

    try {
      await createTransactions(addedTransactions);
    } catch (transactionsError) {
      console.error({
        message: "Failed to create transactions",
        addedTransactions,
        transactionsError,
      });
    }

    // Update transactions
    const updatedTransactions = modified.map((plaidTransaction) =>
      normalizeTransaction(plaidTransaction),
    );

    try {
      await updateTransactions(updatedTransactions);
    } catch (transactionsError) {
      console.error({
        message: "Failed to update transactions",
        addedTransactions,
        transactionsError,
      });
    }

    // Delete transactions
    const removedTransactions = removed.map(
      (plaidTransaction) => plaidTransaction.transaction_id,
    );

    try {
      await deleteTransactions(removedTransactions);
    } catch (transactionsError) {
      console.error({
        message: "Failed to remove transactions",
        removedTransactions,
        transactionsError,
      });
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
