import {
  Configuration,
  CountryCode,
  LinkTokenCreateRequest,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from "plaid";

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

const plaid = new PlaidApi(configuration);

export async function createLinkToken(userId: string) {
  const products: Products[] = [Products.Assets, Products.Transactions];
  const country_codes: CountryCode[] = [CountryCode.Ca];
  const request: LinkTokenCreateRequest = {
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
