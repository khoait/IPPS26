import { test as setup } from "@playwright/test";
import { DATAVERSE_AUTH_FILE } from "../utils/constants";
import { getAccessToken } from "../utils/dataverse-token";

setup("authenticate dataverse api", async ({ baseURL }) => {
  await getAccessToken(baseURL!, DATAVERSE_AUTH_FILE);
});
