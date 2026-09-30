import { CaseFormPage } from "@pages/case-form.page";
import { CaseViewPage } from "@pages/case-view.page";
import test, { expect } from "@playwright/test";

test.describe("Regression Test Suite", { tag: ["@regression"] }, () => {
  test("user can create a new case", async ({ page, baseURL }) => {
    const caseView = new CaseViewPage(page, baseURL!);
    const caseForm = new CaseFormPage(page, baseURL!);

    await caseView.goto();
    await caseView.newCase();

    await caseForm.setTitle("Unable to access application");
    await caseForm.setCustomer("John Doe");
    await caseForm.setPriority("Low");
    await caseForm.setDescription("User is unable to access the application.");
    await caseForm.save();

    await expect(caseForm.getCaseNumberField()).not.toBeEmpty();
  });

  test("user can search by case number", async ({ page, baseURL }) => {
    const caseView = new CaseViewPage(page, baseURL!);
    await caseView.goto();
    await caseView.searchCase("C-0");
    const caseRow = caseView.caseRowByCaseNumber("C-0");
    await expect(caseRow).toBeVisible();
  });
});
