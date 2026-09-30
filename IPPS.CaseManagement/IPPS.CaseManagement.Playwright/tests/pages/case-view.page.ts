import type { Locator, Page } from "@playwright/test";
import { ipps_caseAttributes, ipps_caseMetadata } from "../types";
import { getNavigationUrl, type XrmNavigationPageInputEntityList } from "../utils/xrm-navigation";

export class CaseViewPage {
  readonly searchBox: Locator;
  readonly newCaseButton: Locator;

  constructor(
    private page: Page,
    private baseUrl: string,
  ) {
    this.searchBox = page.getByRole("searchbox");
    this.newCaseButton = page.locator('button[data-id*="ipps_case.NewRecord"]');
  }

  async goto(pageInput?: Pick<XrmNavigationPageInputEntityList, "appName" | "viewId">) {
    const pageUrl = getNavigationUrl(this.baseUrl, {
      appName: pageInput?.appName,
      pageType: "entitylist",
      etn: ipps_caseMetadata.logicalName,
      viewId: pageInput?.viewId,
    });
    await this.page.goto(pageUrl);
  }

  async searchCase(keyword: string) {
    await this.searchBox.fill(keyword);
    await this.searchBox.press("Enter");
    await this.page.waitForTimeout(1000);
  }

  caseRowByCaseNumber(caseNumber: string): Locator {
    return this.page.locator(
      `div[role="gridcell"][col-id="${ipps_caseAttributes.ipps_casenumber}"] label[aria-label*="${caseNumber}"]`,
    );
  }

  async newCase() {
    await this.newCaseButton.click();
  }
}
