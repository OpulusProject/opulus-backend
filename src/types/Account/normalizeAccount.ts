import { AccountBase as PlaidAccount } from "plaid";

import { Account } from "./Account";

export function normalizeAccount(
  itemId: string,
  account: PlaidAccount,
): Account {
  return {
    itemId,
    plaidId: account.account_id,
    mask: account.mask,
    name: account.name,
    officialName: account.official_name,
    type: account.type,
    subtype: account.subtype,
    availableBalance: account.balances.available,
    currentBalance: account.balances.current,
    limit: account.balances.limit,
    currencyCode:
      account.balances.iso_currency_code ??
      account.balances.unofficial_currency_code,
  };
}
