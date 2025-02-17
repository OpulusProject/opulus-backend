import { Request, Response } from "express";

import { WebhookInput } from "@schema/webhookSchema";
import { getItem } from "@services/item/getItem";
import { createAccounts } from "@src/services/account/createAccounts";
import { updateItem } from "@src/services/item/updateItem";
import { getPlaidAccounts } from "@src/services/plaid/getPlaidAccounts";
import { transactionsSync } from "@src/services/plaid/transactionsSync";
import { createTransactions } from "@src/services/transaction/createTransactions";
import { deleteTransactions } from "@src/services/transaction/deleteTransactions";
import { updateTransactions } from "@src/services/transaction/updateTransactions";
import { normalizeAccount } from "@src/types/Account/normalizeAccount";
import { normalizeTransaction } from "@src/types/Transaction/normalizeTransaction";

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
      res.status(404).json({
        message: "Item not found",
      });
      return;
    }

    const getPlaidAccountsResponse = await getPlaidAccounts(item.accessToken);
    const plaidAccounts = getPlaidAccountsResponse.data.accounts;

    const accounts = plaidAccounts.map((plaidAccount) =>
      normalizeAccount(item.plaidId, plaidAccount),
    );

    try {
      await createAccounts(accounts);
    } catch (accountsError) {
      console.error({
        message: "Failed to create accounts",
        accounts,
        accountsError,
      });
    }

    const transactions = await transactionsSync(
      item.accessToken,
      item.transactionCursor || undefined,
    );

    const { added, modified, removed, transactionCursor } = transactions;

    // Update item with latest transactionCursor
    const updatedItem = {
      ...item,
      transactionCursor,
    };

    try {
      await updateItem(updatedItem);
    } catch (itemError) {
      console.error({
        message: "Failed to update item",
        updatedItem,
        itemError,
      });
    }

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
      `[TRANSACTIONS WEBHOOK] ${webhookCode} - ${plaidItemId}: ${added.length} added, ${modified.length} modified, ${removed.length} removed`,
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
