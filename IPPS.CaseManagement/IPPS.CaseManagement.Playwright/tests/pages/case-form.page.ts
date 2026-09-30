import type { Locator, Page } from "@playwright/test";
import { ipps_caseAttributes, ipps_caseMetadata } from "../types";
import { getNavigationUrl, type XrmNavigationPageInputEntityRecord } from "../utils/xrm-navigation";

export class CaseFormPage {
  readonly saveButton: Locator;
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
      `div[data-id="${ipps_caseAttributes.ipps_resolution}"] input`,
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
    await this.page.waitForTimeout(2000);
    await this.customerField.focus();
    await this.customerField.press("Enter");
  }

  async setPriority(priority: string) {
    await this.priorityField.click();
    const dropdownId = await this.priorityField.getAttribute("aria-controls");
    await this.page.locator(`#${dropdownId} [role="option"]`, { hasText: priority }).click();
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

  getCaseNumberField() {
    return this.caseNumberField;
  }
}
