import { AccountsGetRequest } from "plaid";

import { plaid } from "./plaid";

export async function getPlaidItem(accessToken: string) {
  const request: AccountsGetRequest = {
    access_token: accessToken,
  };

  return await plaid.itemGet(request);
}
