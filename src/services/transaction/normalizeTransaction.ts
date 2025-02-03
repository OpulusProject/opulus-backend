//todo: this should go under a types directory

import { Transaction as PlaidTransaction } from "plaid";

// take plaid's definition of a transaction and converts it to ours
export function normalizeTransaction(transaction: PlaidTransaction) {
  return {
    plaidId: transaction.transaction_id,
    accountId: transaction.account_id,
    amount: transaction.amount,
    currencyCode:
      transaction.iso_currency_code ?? transaction.unofficial_currency_code,
    pending: transaction.pending,
    date: transaction.date,
    authorizedDate: transaction.authorized_date,
    paymentChannel: transaction.payment_channel,
    transactionCode: transaction.transaction_code,
    address: transaction.location?.address,
    city: transaction.location?.city,
    region: transaction.location?.region,
    postalCode: transaction.location?.postal_code,
    country: transaction.location?.country,
    name: transaction.name,
    merchantName: transaction.merchant_name,
    logoURL: transaction.logo_url,
    website: transaction.website,
  };
}
