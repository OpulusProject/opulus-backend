import { User } from "@prisma/client";
import { Request, Response } from "express";
import { PlaidError } from "plaid";

import { createLinkToken } from "@service/plaidService";

export async function createLinkTokenHandler(req: Request, res: Response) {
  try {
    const user = res.locals.user as User;
    const userId = user.id.toString();
    const linkTokenResponse = await createLinkToken(userId);

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
