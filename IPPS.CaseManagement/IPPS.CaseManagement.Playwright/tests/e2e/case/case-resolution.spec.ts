import { test } from "@fixtures/case.fixture";
import { CaseFormPage } from "@pages/case-form.page";
import { expect } from "@playwright/test";
import { AppNames } from "../../utils/constants";

test.describe("case resolution", { tag: ["@full"] }, () => {
  test("user can resolve a case", async ({ page, baseURL, normalPriorityCaseId }) => {
    const caseForm = new CaseFormPage(page, baseURL!);

    await caseForm.goto({
      id: normalPriorityCaseId,
      appName: AppNames.CASE_MANAGEMENT,
    });

    await caseForm.setCustomer("John Doe");
    await caseForm.setAssignedTo("Khoa Nguyen");
    await caseForm.setResolution("Issue resolved by support team");
    await caseForm.save();

    await caseForm.clickMarkAsResolved();
    await caseForm.clickConfirmDialog();

    const statusHeader = caseForm.getStatusReasonHeader();
    console.log("Status Header Text: ", await statusHeader.textContent());
    await expect(statusHeader).toContainText("Resolved");
  });

  test("user should see an error when trying to resolve a case without assignee or resolution", async ({
    page,
    baseURL,
    normalPriorityCaseId,
  }) => {
    const caseForm = new CaseFormPage(page, baseURL!);

    await caseForm.goto({
      id: normalPriorityCaseId,
      appName: AppNames.CASE_MANAGEMENT,
    });

    await caseForm.setCustomer("John Doe");
    await caseForm.setAssignedTo("");
    await caseForm.setResolution("");
    await caseForm.save();

    await caseForm.clickMarkAsResolved();

    const dialogTitle = caseForm.getDialogTitle();
    await expect(dialogTitle).toContainText("Resolve Case");
  });
});
