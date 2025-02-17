import {
  RemovedTransaction,
  Transaction,
  TransactionsSyncRequest,
} from "plaid";

import { plaid } from "./plaid";

export async function transactionsSync(
  accessToken: string,
  cursor?: string,
  retries: number = 3,
) {
  let added: Array<Transaction> = [];
  let modified: Array<Transaction> = [];
  let removed: Array<RemovedTransaction> = [];
  let hasMore = true;
  let transactionCursor = cursor;

  try {
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const request: TransactionsSyncRequest = {
        access_token: accessToken,
        cursor: transactionCursor,
      };

      const transactions = await plaid.transactionsSync(request);

      const data = transactions.data;

      // Add this page of results
      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);

      hasMore = data.has_more;
      transactionCursor = data.next_cursor;
    }
  } catch (error) {
    console.error(`Error fetching transactions: ${(error as Error).message}`);
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for 1 second
      return transactionsSync(accessToken, cursor, retries - 1);
    } else {
      throw error;
    }
  }

  return { added, modified, removed, transactionCursor, accessToken };
}
