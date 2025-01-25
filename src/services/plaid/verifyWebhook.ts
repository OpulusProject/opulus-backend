import JWT from "jose";
import { Message, sha256 } from "js-sha256";
import { jwtDecode } from "jwt-decode";
import { JWKPublicKey } from "plaid";
import safeCompare from "safe-compare";

import { plaid } from "./plaid";

const KEY_CACHE = new Map<string, JWKPublicKey>();

export async function verifyWebhook(
  body: Message,
  headers: Record<string, string>,
) {
  const signedJwt = headers["plaid-verification"];
  const decodedToken = jwtDecode(signedJwt);

  // Extract the JWT header
  const decodedTokenHeader = jwtDecode(signedJwt, { header: true });

  // Extract the kid value from the header
  const currentKeyID = decodedTokenHeader.kid ?? "";

  // If key not in cache, update the key cache
  if (!KEY_CACHE.has(currentKeyID)) {
    const keyIDsToUpdate: string[] = [];
    KEY_CACHE.forEach((key, keyID) => {
      // We will also want to refresh any not-yet-expired keys
      if (key.expired_at == null) {
        keyIDsToUpdate.push(keyID);
      }
    });

    keyIDsToUpdate.push(currentKeyID);

    for (const keyID of keyIDsToUpdate) {
      const response = await plaid.webhookVerificationKeyGet({
        key_id: keyID,
      });

      const key = response.data.key;
      KEY_CACHE.set(keyID, key);
    }
  }

  // If the key ID is not in the cache, the key ID may be invalid.
  if (!KEY_CACHE.has(currentKeyID)) {
    return false;
  }

  // Fetch the current key from the cache.
  const key = KEY_CACHE.get(currentKeyID);

  // Reject expired keys.
  if (!key || key.expired_at != null) {
    return false;
  }

  // Validate the signature and iat
  try {
    const keyLike = await JWT.importJWK(key);

    // This will throw an error if verification fails
    await JWT.jwtVerify(signedJwt, keyLike, {
      maxTokenAge: "5 min",
    });
  } catch (error) {
    console.error("Unknown error validating key:", error);
    return false;
  }

  // Compare hashes.
  const bodyHash = sha256(body);
  const claimedBodyHash = (decodedToken as { request_body_sha256: string })
    .request_body_sha256;
  return safeCompare(bodyHash, claimedBodyHash);
}
