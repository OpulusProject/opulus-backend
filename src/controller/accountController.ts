import { Account, Balance, User } from "@prisma/client";
import { Request, Response } from "express";

import { createAccount } from "@service/accountService";
import { exchangePublicToken, getPlaidAccounts } from "@service/plaidService";
import { CreateAccountInput } from "@schema/accountSchema";

export async function createAccountsHandler(
  req: Request<object, object, CreateAccountInput>,
  res: Response,
) {
  const user = res.locals.user as User;
  const { publicToken } = req.body;
  try {
    // Exchange the public token for an access token
    const accessTokenResponse = await exchangePublicToken(publicToken);
    const accessToken = accessTokenResponse.data.access_token;

    // Retrieve accounts from Plaid
    const getPlaidAccountsResponse = await getPlaidAccounts(accessToken);
    const plaidAccounts = getPlaidAccountsResponse.data.accounts;

    const createdAccounts = [];

    for (const plaidAccount of plaidAccounts) {
      try {
        const accountId = plaidAccount.account_id;
        const account: Account = {
          id: accountId,
          userId: user.id,
          accessToken,
          mask: plaidAccount.mask,
          name: plaidAccount.name,
          officialName: plaidAccount.official_name,
          type: plaidAccount.type,
          subtype: plaidAccount.subtype,
        };

        const balance: Omit<Balance, "accountId"> = {
          current: plaidAccount.balances.current,
          isoCurrencyCode: plaidAccount.balances.iso_currency_code,
          unofficialCurrencyCode:
            plaidAccount.balances.unofficial_currency_code,
          lastUpdate: new Date(),
        };

        const newAccount = await createAccount(account, balance);
        createdAccounts.push(newAccount);
      } catch (accountError) {
        console.error(
          `Failed to create account ${plaidAccount.account_id}:`,
          accountError,
        );
        continue;
      }
    }

    res.status(200).json({
      message: "Accounts created successfully",
      createdAccounts,
    });
  } catch (error) {
    console.error("Unknown error creating accounts:", error);
    res.status(500).json({
      message: "Could not create accounts",
      error: (error as Error).message,
    });
  }
}
