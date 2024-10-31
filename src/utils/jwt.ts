import config from "config";
import { SignOptions, sign, verify } from "jsonwebtoken";

export function signJwt(
  object: object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options?: SignOptions,
) {
  const signingKey = Buffer.from(
    config.get<string>(keyName),
    "base64",
  ).toString("ascii");

  return sign(object, signingKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt<T>(
  token: string,
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey",
): T | null {
  const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString(
    "ascii",
  );

  try {
    const decoded = verify(token, publicKey) as T;
    return decoded;
  } catch (e) {
    console.error("JWT verification failed:", e);
    return null;
  }
}
