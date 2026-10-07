import fs from "node:fs";
import path from "node:path";
import { ClientSecretCredential } from "@azure/identity";
import "dotenv/config";

export type AccessToken = {
  token: string;
  expiresOn: number;
};

export async function getAccessToken(baseURL: string, cacheFilePath: string) {
  const cachedToken = getCachedAccessToken(cacheFilePath);
  if (cachedToken && isTokenValid(cachedToken.expiresOn)) {
    return cachedToken;
  }

  const token = await getNewAccessToken(baseURL);
  fs.mkdirSync(path.dirname(cacheFilePath), { recursive: true });
  fs.writeFileSync(cacheFilePath, JSON.stringify(token));
  return token;
}

async function getNewAccessToken(baseURL: string) {
  const credential = new ClientSecretCredential(
    process.env.TenantId!,
    process.env.ClientId!,
    process.env.ClientSecret!,
  );

  const scopeUrl = new URL(".default", baseURL);

  const token = await credential.getToken(scopeUrl.toString());

  return {
    token: token.token,
    expiresOn: token.expiresOnTimestamp - 5 * 60 * 1000, // Subtract 5 minutes buffer
  };
}

function getCachedAccessToken(cacheFilePath: string) {
  if (fs.existsSync(cacheFilePath)) {
    try {
      const raw = fs.readFileSync(cacheFilePath, "utf-8");
      const cachedToken = JSON.parse(raw);
      return cachedToken as AccessToken;
    } catch {
      // ignored
    }
  }
  return null;
}

function isTokenValid(expiresOn: number) {
  return expiresOn && expiresOn > Date.now();
}
