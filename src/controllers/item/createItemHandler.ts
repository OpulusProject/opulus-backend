import { User } from "@prisma/client";
import { Request, Response } from "express";

import { CreateItemInput } from "@schema/itemSchema";
import { createAccount } from "@services/account/createAccount";
import { createItem } from "@services/item/createItem";
import { getItem } from "@services/item/getItem";
import { exchangePublicToken } from "@services/plaid/exchangePublicToken";
import { getInstitutionById } from "@services/plaid/getInstitutionById";
import { getPlaidAccounts } from "@services/plaid/getPlaidAccounts";
import { getPlaidItem } from "@services/plaid/getPlaidItem";

export async function createItemHandler(
  req: Request<object, object, CreateItemInput>,
  res: Response,
) {
  const user = res.locals.user as User;
  const userId = user.id;

  const { publicToken } = req.body;

  try {
    const exchangePublicTokenResponse = await exchangePublicToken(publicToken);
    const accessToken = exchangePublicTokenResponse.data.access_token;

    const getPlaidItemResponse = await getPlaidItem(accessToken);
    const plaidItem = getPlaidItemResponse.data.item;

    const institutionId = plaidItem.institution_id;
    let institutionName: string | undefined;

    if (institutionId) {
      // Check if item already exists in the database
      const getItemResponse = await getItem(userId, { institutionId });
      console.log(getItemResponse);

      if (getItemResponse) {
        res.status(409).json({
          message: "Item already exists",
          item: getItemResponse,
        });
        return;
      }

      // Add the institution name to the item
      const institutionResponse = await getInstitutionById(institutionId);
      institutionName = institutionResponse.data.institution.name;
    }

    const item = {
      plaidId: plaidItem.item_id,
      userId,
      accessToken,
      institutionId,
      institutionName,
    };

    const createdItem = await createItem(item);

    // Create accounts in the database at the same time to avoid orphaned items
    const getPlaidAccountsResponse = await getPlaidAccounts(accessToken);
    const plaidAccounts = getPlaidAccountsResponse.data.accounts;

    const createdAccounts = [];

    for (const plaidAccount of plaidAccounts) {
      try {
        const accountId = plaidAccount.account_id;
        const account = {
          id: accountId,
          plaidId: plaidAccount.account_id,
          itemId: createdItem.id,
          mask: plaidAccount.mask,
          name: plaidAccount.name,
          officialName: plaidAccount.official_name,
          type: plaidAccount.type,
          subtype: plaidAccount.subtype,
          availableBalance: plaidAccount.balances.available,
          currentBalance: plaidAccount.balances.current,
          limit: plaidAccount.balances.limit,
          currencyCode:
            plaidAccount.balances.iso_currency_code ??
            plaidAccount.balances.unofficial_currency_code,
        };

        const newAccount = await createAccount(account);
        createdAccounts.push(newAccount);
      } catch (accountError) {
        console.error({
          message: `Failed to create account ${plaidAccount.account_id}:`,
          accountError,
        });
        continue;
      }
    }

    res.status(200).json({
      message: "Item and accounts created successfully",
      createdItem,
      createdAccounts,
    });
  } catch (error) {
    console.error("Unknown error creating item:", error);
    res.status(500).json({
      message: "Could not create item",
      error: (error as Error).message,
    });
  }
}
