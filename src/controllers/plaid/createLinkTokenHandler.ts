import { User } from "@prisma/client";
import { Request, Response } from "express";
import { PlaidError } from "plaid";

import { createLinkSession } from "@services/linkSession/createLinkSession";
import { createLinkToken } from "@services/plaid/createLinkToken";
import { createPlaidUser } from "@services/plaid/createPlaidUser";
import { getUser } from "@services/user/getUser";
import { updateUser } from "@services/user/updateUser";

export async function createLinkTokenHandler(req: Request, res: Response) {
  try {
    const user = res.locals.user as User;
    const userId = user.id;

    const userResponse = await getUser({ userId });

    if (!userResponse) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    let userToken = userResponse.plaidUserToken;

    // User does not have an associated Plaid User
    if (!userToken) {
      const createPlaidUserResponse = await createPlaidUser(userId);
      const { user_token: plaidUserToken, user_id: plaidId } =
        createPlaidUserResponse.data;
      userToken = plaidUserToken;

      await updateUser({ id: userId, plaidId, plaidUserToken });
    }

    const linkTokenResponse = await createLinkToken(userToken, userId);
    const linkToken = linkTokenResponse.data.link_token;

    // Store the link token in our database
    await createLinkSession({ userId, linkToken });

    res.status(200).json({ linkToken });
  } catch (error) {
    if (error as PlaidError) {
      const plaidError = error as PlaidError;
      console.error("Plaid error:", plaidError);
    } else {
      console.error("Unknown error creating link token:", error);
      res.status(500).json({
        message: "Could not create link token",
        error: (error as Error).message,
      });
    }
  }
}
