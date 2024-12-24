import axios from "axios";
import config from "config";
import { stringify } from "qs";

interface GoogleTokensResult {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  id_token: string;
}

export async function getGoogleOAuthTokens(
  code: string,
): Promise<GoogleTokensResult> {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    code,
    client_id: config.get("googleClientId"),
    client_secret: config.get("googleClientSecret"),
    redirect_uri: config.get("googleOAuthRedirectUrl"),
    grant_type: "authorization_code",
  };

  console.log(values);

  try {
    const res = await axios.post<GoogleTokensResult>(url, stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching Google OAuth tokens:", error);
    throw new Error("Failed to fetch Google OAuth tokens");
  }
}
