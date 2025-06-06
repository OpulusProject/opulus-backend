import { CountryCode, LinkTokenCreateRequest, Products } from "plaid";

import { plaid } from "./plaid";

const WEBHOOK_URL = process.env.WEBHOOK_URL;

export async function createLinkToken(userToken: string, userId: string) {
  const products: Products[] = [Products.Assets, Products.Transactions];
  const country_codes: CountryCode[] = [CountryCode.Ca];
  const request: LinkTokenCreateRequest = {
    user_token: userToken,
    user: {
      client_user_id: userId,
    },
    client_name: "Opulus",
    enable_multi_item_link: true,
    products,
    country_codes,
    language: "en",
    transactions: {
      days_requested: 730,
    },
    webhook: `${WEBHOOK_URL}/webhook`,
  };

  return await plaid.linkTokenCreate(request);
}
