import { ItemPublicTokenExchangeRequest } from "plaid";

import { plaid } from "./plaid";

// Exchange a public token for an access token. Used to create a new item.
export async function exchangePublicToken(publicToken: string) {
  const request: ItemPublicTokenExchangeRequest = {
    public_token: publicToken,
  };

  return await plaid.itemPublicTokenExchange(request);
}
