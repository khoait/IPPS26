import { test as base } from "@playwright/test";
import { ExtendedDataverseClient } from "../services/ExtendedDataverseClient";

export const test = base.extend<{ dataverseClient: ExtendedDataverseClient }>({
  dataverseClient: async ({ page }, use) => {
    const client = new ExtendedDataverseClient();
    await use(client);
  },
});
