import { Request, Response } from "express";

import { WebhookInput } from "@schema/webhookSchema";
import { createItem } from "@services/item/createItem";
import { getItem } from "@services/item/getItem";
import { getLinkSession } from "@services/linkSession/getLinkSession";
import { exchangePublicToken } from "@services/plaid/exchangePublicToken";
import { getInstitutionById } from "@services/plaid/getInstitutionById";
import { getPlaidItem } from "@services/plaid/getPlaidItem";
import { transactionsSync } from "@services/plaid/transactionsSync";
import { normalizeItem } from "@src/types/Item/normalizeItem";

export async function createItemHandler(
  req: Request<object, object, WebhookInput>,
  res: Response,
) {
  const {
    webhook_code: webhookCode,
    public_token: publicToken,
    link_session_id: linkSessionId,
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

    // To receive the SYNC_UPDATES_AVAILABLE webhook for an item, we need to sync transactions at least once
    // Assume this first call returns an empty array since its immediately called after the item has been created
    const transactionsSyncReponse = await transactionsSync(accessToken);
    const transactionCursor = transactionsSyncReponse.data.next_cursor;

    // Create the Item
    const item = normalizeItem(
      plaidItem,
      userId,
      accessToken,
      transactionCursor,
      institutionName,
    );

    try {
      await createItem(item);
    } catch (itemError) {
      throw new Error(`Failed to create item: ${(itemError as Error).message}`);
    }

    console.log(
      `[LINK WEBHOOK] ${webhookCode} - ${linkSessionId} - ${item.plaidId} created`,
    );

    // I'm not actually sure if we need to return a response, or who we're responding to
    // Should look into this
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
