import type { Locator, Page } from "@playwright/test";
import { ipps_caseAttributes, ipps_caseMetadata } from "../types";
import { getNavigationUrl, type XrmNavigationPageInputEntityRecord } from "../utils/xrm-navigation";

export class CaseFormPage {
  readonly saveButton: Locator;
  readonly markAsResolvedButton: Locator;
  readonly confirmDialogButton: Locator;
  readonly caseNumberField: Locator;
  readonly caseTitleField: Locator;
  readonly caseDescriptionField: Locator;
  readonly customerField: Locator;
  readonly priorityField: Locator;
  readonly assignedToField: Locator;
  readonly resolutionField: Locator;

  constructor(
    private page: Page,
    private baseUrl: string,
  ) {
    this.saveButton = page.locator('button[data-id$="ipps_case.Save"]');
    this.markAsResolvedButton = page.locator('button[data-id$="ipps_case.MarkAsResolved.Button"]');
    this.confirmDialogButton = page.locator('button[data-id="confirmButton"]');
    this.caseNumberField = page.locator(
      `div[data-id="${ipps_caseAttributes.ipps_casenumber}"] input`,
    );
    this.caseTitleField = page.locator(`div[data-id="${ipps_caseAttributes.ipps_name}"] input`);
    this.caseDescriptionField = page.locator(
      `div[data-id="${ipps_caseAttributes.ipps_description}"] textarea`,
    );
    this.customerField = page.locator(
      `div[data-id="${ipps_caseAttributes.ipps_customerid}"] input[role="combobox"]`,
    );
    this.priorityField = page.locator(
      `div[data-id="${ipps_caseAttributes.ipps_Priority}"] button[role="combobox"]`,
    );
    this.assignedToField = page.locator(
      `div[data-id="${ipps_caseAttributes.ipps_assignedto}"] input`,
    );
    this.resolutionField = page.locator(
      `div[data-id="${ipps_caseAttributes.ipps_resolution}"] textarea`,
    );
  }

  async goto({
    appName,
    formId,
    id,
  }: Pick<XrmNavigationPageInputEntityRecord, "appName" | "formId" | "id">) {
    const pageUrl = getNavigationUrl(this.baseUrl, {
      appName: appName,
      pageType: "entityrecord",
      etn: ipps_caseMetadata.logicalName,
      formId: formId,
      id: id,
    });
    await this.page.goto(pageUrl);
  }

  async setTitle(title: string) {
    await this.caseTitleField.fill(title);
  }

  async setDescription(description: string) {
    await this.caseDescriptionField.fill(description);
  }

  async setCustomer(customer: string) {
    await this.customerField.fill(customer);
    await this.page.waitForTimeout(3000);
    await this.customerField.focus();
    await this.customerField.press("Enter");
  }

  async setPriority(priority: string) {
    await this.priorityField.click();
    await this.page.waitForTimeout(100);
    await this.page.getByRole("option", { name: priority }).click();
  }

  async setAssignedTo(assignedTo: string) {
    await this.assignedToField.fill(assignedTo);
  }

  async setResolution(resolution: string) {
    await this.resolutionField.fill(resolution);
  }

  async save() {
    await this.saveButton.click();
    await this.page.waitForTimeout(2000);
  }

  async clickMarkAsResolved() {
    await this.markAsResolvedButton.click();
    await this.page.waitForTimeout(2000);
  }

  async clickConfirmDialog() {
    await this.confirmDialogButton.click();
    await this.page.waitForTimeout(2000);
  }

  getCaseTitleField() {
    return this.caseTitleField;
  }

  getCaseNumberField() {
    return this.caseNumberField;
  }

  getCustomerField() {
    return this.customerField.or(
      this.page.locator(`div[data-id="${ipps_caseAttributes.ipps_customerid}"] ul`),
    );
  }

  getFieldError(fieldName: ipps_caseAttributes) {
    return this.page.locator(`div[data-id="${fieldName}"] [data-id$="error-message"]`);
  }

  getStatusReasonHeader() {
    return this.page.locator(`[data-name="header_statuscode"]`);
  }

  getDialogTitle() {
    return this.page.locator(`[data-id="dialogTitleText"]`);
  }
}
