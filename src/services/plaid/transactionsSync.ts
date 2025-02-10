import { TransactionsSyncRequest } from "plaid";

import { plaid } from "./plaid";

export async function transactionsSync(accessToken: string) {
  const request: TransactionsSyncRequest = {
    access_token: accessToken,
  };

  return await plaid.transactionsSync(request);
}
