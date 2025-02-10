import config from "config";
import { Request, Response } from "express";

import { getGoogleOAuthTokens } from "@services/auth/getGoogleOAuthTokens";
import { getGoogleUser } from "@services/auth/getGoogleUser";
import { createUser } from "@services/user/createUser";
import { getUser } from "@services/user/getUser";
import { updateUser } from "@services/user/updateUser";

import { issueTokens } from "./issueTokens";

export async function googleOAuthHandler(req: Request, res: Response) {
  const code = req.query.code as string;
  const error = req.query.error as string;

  if (error) {
    res.redirect(config.get("clientURL"));
    return;
  }

  try {
    const { id_token, access_token } = await getGoogleOAuthTokens(code);
    const googleUser = await getGoogleUser(id_token, access_token);

    if (!googleUser.verified_email) {
      res.redirect(config.get("clientURL"));
      return;
    }

    const email = googleUser.email;
    let user = await getUser({ email });

    if (user) {
      user = await updateUser({
        id: user.id,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        email: googleUser.email,
      });
    } else {
      user = await createUser(googleUser.email, "", {
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        email: googleUser.email,
      });
    }

    issueTokens(res, user);
    res.redirect(config.get("clientURL"));
  } catch (error) {
    res.status(500).json({
      message: "Failed to handle Google OAuth.",
      error: (error as Error).message,
    });
  }
}
