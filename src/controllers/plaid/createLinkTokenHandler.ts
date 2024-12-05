import { User } from "@prisma/client";
import { Request, Response } from "express";
import { PlaidError } from "plaid";

import { createLinkToken } from "@services/plaid/createLinkToken";
import { createPlaidUser } from "@services/plaid/createPlaidUser";
import { findUserById } from "@services/user/findUserById";
import { updateUser } from "@services/user/updateUser";

export async function createLinkTokenHandler(req: Request, res: Response) {
  try {
    const user = res.locals.user as User;
    const userId = user.id;

    const userResponse = await findUserById(userId);

    if (!userResponse) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    let userToken: string;

    if (userResponse.plaidUserToken) {
      userToken = userResponse.plaidUserToken;
    } else {
      const createPlaidUserResponse = await createPlaidUser(userId);
      userToken = createPlaidUserResponse.data.user_token;
      await updateUser(userId, { plaidUserToken: userToken });
    }

    const linkTokenResponse = await createLinkToken(userToken, userId);

    res.status(200).json({
      linkToken: linkTokenResponse.data.link_token,
    });
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
