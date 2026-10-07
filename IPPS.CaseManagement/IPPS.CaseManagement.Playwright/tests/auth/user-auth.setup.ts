import { test as setup } from "@playwright/test";
import "dotenv/config";
import { USER_AUTH_FILE } from "../utils/constants";

setup("authenticate", async ({ page, baseURL }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto(baseURL!);
  await page.locator('[type="email"]').fill(process.env.TestUserName!);
  await page.locator('input[type="submit"]').click();
  await page.locator('[type="password"]').fill(process.env.TestUserPassword!);
  await page.locator('input[type="submit"]').click();
  await page.locator('input[type="checkbox"]').check();
  await page.locator('input[type="submit"]').click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL("**/main.aspx*");

  // End of authentication steps.
  await page.context().storageState({ path: USER_AUTH_FILE });
});
