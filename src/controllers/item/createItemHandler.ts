import { Request, Response } from "express";

import { WebhookInput } from "@schema/webhookSchema";
import { createAccounts } from "@services/account/createAccounts";
import { createItem } from "@services/item/createItem";
import { getItem } from "@services/item/getItem";
import { getLinkSession } from "@services/linkSession/getLinkSession";
import { exchangePublicToken } from "@services/plaid/exchangePublicToken";
import { getInstitutionById } from "@services/plaid/getInstitutionById";
import { getPlaidAccounts } from "@services/plaid/getPlaidAccounts";
import { getPlaidItem } from "@services/plaid/getPlaidItem";
import { transactionsSync } from "@services/plaid/transactionsSync";
import { createTransaction } from "@services/transaction/createTransaction";
import { normalizeTransaction } from "@services/transaction/normalizeTransaction";
import { normalizeAccount } from "src/types/Account/normalizeAccount";

export async function createItemHandler(
  req: Request<object, object, WebhookInput>,
  res: Response,
) {
  const {
    webhook_code: webhookCode,
    public_token: publicToken,
    link_token: linkToken,
  } = req.body;

  try {
    // Retrieve the link session from the database for userId
    const linkSessionResponse = await getLinkSession({
      linkToken: linkToken as string,
    });

    if (!linkSessionResponse) {
      res.status(409).json({
        message: "Link session does not exist",
      });
      return;
    }

    const userId = linkSessionResponse.userId;

    // Exchange public token for an access token
    const exchangePublicTokenResponse = await exchangePublicToken(
      publicToken as string,
    );
    const accessToken = exchangePublicTokenResponse.data.access_token;

    // Retrieve the item from Plaid
    const getPlaidItemResponse = await getPlaidItem(accessToken);
    const plaidItem = getPlaidItemResponse.data.item;

    const institutionId = plaidItem.institution_id;
    let institutionName: string | undefined;

    if (institutionId) {
      // Check if institution has already been linked to Opulus
      const getItemResponse = await getItem({ userId, institutionId });

      if (getItemResponse) {
        res.status(409).json({
          message: "Item has already been linked",
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

    await createItem(item);

    // Create accounts in the database at the same time to avoid orphaned items
    const getPlaidAccountsResponse = await getPlaidAccounts(accessToken);
    const plaidAccounts = getPlaidAccountsResponse.data.accounts;
    const accounts = plaidAccounts.map((plaidAccount) =>
      normalizeAccount(plaidItem.item_id, plaidAccount),
    );

    try {
      await createAccounts(accounts);
    } catch (accountError) {
      console.error({
        message: "Failed to create accounts",
        accounts,
        accountError,
      });
    }

    // To receive the SYNC_UPDATES_AVAILABLE webhook for an item, we need to sync transactions at least once
    // Note: this first call might return an empty array since its immediately called after the item has been created
    const transactionsSyncReponse = await transactionsSync(item.accessToken);
    const { added } = transactionsSyncReponse.data;

    for (const transaction of added) {
      await createTransaction(normalizeTransaction(transaction));
    }

    console.log(
      `${webhookCode} - ${plaidItem.item_id}: ${plaidAccounts.length} accounts added, ${added.length} transactions added`,
    );
    res.status(200).json({
      message: "Item created successfully",
    });
  } catch (error) {
    console.error("Unknown error creating item:", error);
    res.status(500).json({
      message: "Could not create item",
      error: (error as Error).message,
    });
  }
}
