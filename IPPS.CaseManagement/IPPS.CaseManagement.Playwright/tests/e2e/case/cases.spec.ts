import { test } from "@fixtures/case.fixture";
import { CaseFormPage } from "@pages/case-form.page";
import { CaseViewPage } from "@pages/case-view.page";
import { expect } from "@playwright/test";
import { AppNames } from "../../utils/constants";

test.describe("core functionality", { tag: ["@regression"] }, () => {
  test("user can create a new case", async ({ page, baseURL }) => {
    const caseView = new CaseViewPage(page, baseURL!);
    const caseForm = new CaseFormPage(page, baseURL!);

    await caseView.goto({ appName: AppNames.CASE_MANAGEMENT });
    await caseView.newCase();

    await caseForm.setTitle("Unable to access application");
    await caseForm.setCustomer("John Doe");
    await caseForm.setDescription("User is unable to access the application.");
    await caseForm.save();

    const caseNumberField = caseForm.getCaseNumberField();
    await expect(caseNumberField).not.toBeEmpty();
    await expect(caseNumberField).not.toHaveValue("---");
  });

  test("user can search by case number", async ({ page, baseURL }) => {
    const caseView = new CaseViewPage(page, baseURL!);
    await caseView.goto({ appName: AppNames.CASE_MANAGEMENT });
    await caseView.searchCase("C-0");
    const caseRow = caseView.caseRowByCaseNumber("C-0");
    await expect(caseRow).toBeVisible();
  });

  test("user can edit a case", async ({ page, baseURL, normalPriorityCaseId }) => {
    const caseForm = new CaseFormPage(page, baseURL!);

    await caseForm.goto({
      id: normalPriorityCaseId,
      appName: AppNames.CASE_MANAGEMENT,
    });

    await caseForm.setCustomer("John Doe");
    await caseForm.save();

    const caseCustomerField = caseForm.getCustomerField();

    await expect(caseCustomerField).toHaveText("John Doe");
  });
});
