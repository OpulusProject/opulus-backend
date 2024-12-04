import { ItemPublicTokenExchangeRequest } from "plaid";

import { plaid } from "./plaid";

export async function exchangePublicToken(publicToken: string) {
  const request: ItemPublicTokenExchangeRequest = {
    public_token: publicToken,
  };

  return await plaid.itemPublicTokenExchange(request);
}
