import { test as setup } from "@playwright/test";
import path from "path";
import { getAccessToken } from "../utils/dataverse-token";

export const DATAVERSE_AUTH_FILE = path.join(
  __dirname,
  "../../playwright/.auth/dataverse.json"
);

setup("authenticate dataverse api", async ({ baseURL }) => {
  await getAccessToken(baseURL!, DATAVERSE_AUTH_FILE);
});
