import { CaseFormPage } from "@pages/case-form.page";
import { CaseViewPage } from "@pages/case-view.page";
import test, { expect } from "@playwright/test";
import { ipps_caseAttributes } from "../../types";
import { AppNames } from "../../utils/constants";

test.describe("case validation", { tag: ["@smoke"] }, () => {
  test("user cannot create a case without a title", async ({ page, baseURL }) => {
    const caseView = new CaseViewPage(page, baseURL!);
    const caseForm = new CaseFormPage(page, baseURL!);

    await caseView.goto({ appName: AppNames.CASE_MANAGEMENT });
    await caseView.newCase();

    await caseForm.setCustomer("John Doe");
    await caseForm.setDescription("Test empty title");
    await caseForm.save();

    const titleFieldError = caseForm.getFieldError(ipps_caseAttributes.ipps_name);
    await expect(titleFieldError).toBeVisible();
  });

  test("user cannot create a case without a customer", async ({ page, baseURL }) => {
    const caseView = new CaseViewPage(page, baseURL!);
    const caseForm = new CaseFormPage(page, baseURL!);

    await caseView.goto({ appName: AppNames.CASE_MANAGEMENT });
    await caseView.newCase();

    await caseForm.setTitle("Test");
    await caseForm.setDescription("Test empty customer");
    await caseForm.save();

    const customerFieldError = caseForm.getFieldError(ipps_caseAttributes.ipps_customerid);
    await expect(customerFieldError).toBeVisible();
  });

  test("assigned to field is required when high priority is selected", async ({
    page,
    baseURL,
  }) => {
    const caseView = new CaseViewPage(page, baseURL!);
    const caseForm = new CaseFormPage(page, baseURL!);

    await caseView.goto({ appName: AppNames.CASE_MANAGEMENT });
    await caseView.newCase();

    await caseForm.setTitle("Test");
    await caseForm.setCustomer("John Doe");
    await caseForm.setPriority("High");
    await caseForm.setDescription("Test empty assigned to");
    await caseForm.save();

    const assignedToFieldError = caseForm.getFieldError(ipps_caseAttributes.ipps_assignedto);
    await expect(assignedToFieldError).toBeVisible();
  });
});
