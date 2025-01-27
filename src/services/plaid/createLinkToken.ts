import { CountryCode, LinkTokenCreateRequest, Products } from "plaid";

import { plaid } from "./plaid";

export async function createLinkToken(userToken: string, userId: string) {
  const products: Products[] = [Products.Assets, Products.Transactions];
  const country_codes: CountryCode[] = [CountryCode.Ca];
  const request: LinkTokenCreateRequest = {
    user_token: userToken,
    user: {
      client_user_id: userId,
    },
    client_name: "Opulus",
    products,
    country_codes,
    language: "en",
  };

  return await plaid.linkTokenCreate(request);
}
