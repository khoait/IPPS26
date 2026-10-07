export enum EntityListViewType {
  SystemView = 1039,
  UserView = 4230,
}

export type XrmNavigationPageInputBase = {
  appId?: string;
  appName?: string;
  navbar?: "on" | "off";
  cmdbar?: "true" | "false";
};

export type XrmNavigationPageInputEntityList = {
  pageType: "entitylist";
  etn: string;
  viewId?: string;
  viewType?: EntityListViewType;
} & XrmNavigationPageInputBase;

export type XrmNavigationPageInputEntityRecord = {
  pageType: "entityrecord";
  etn: string;
  id: string;
  formId?: number;
  data?: Record<string, any>;
} & XrmNavigationPageInputBase;

export type XrmNavigationCustomPage = {
  pageType: "custom";
  name: string;
  entityName?: string;
  recordId?: string;
} & XrmNavigationPageInputBase;

export type XrmNavigationPageInputHtmlWebResource = {
  pageType: "webresource";
  webresourceName: string;
  data?: string;
} & XrmNavigationPageInputBase;

export type XrmNavigationDashboard = {
  pageType: "dashboard";
  id: string;
  type?: "system" | "personal";
} & XrmNavigationPageInputBase;

export type XrmNavigationPageInput =
  | XrmNavigationPageInputEntityList
  | XrmNavigationPageInputEntityRecord
  | XrmNavigationCustomPage
  | XrmNavigationPageInputHtmlWebResource
  | XrmNavigationDashboard;

export function getNavigationUrl(baseUrl: string, pageInput: XrmNavigationPageInput): string {
  const url = new URL("main.aspx", baseUrl);
  if (pageInput) {
    for (const [key, value] of Object.entries(pageInput)) {
      if (value === undefined) continue;

      if (typeof value === "object") {
        url.searchParams.append(key, JSON.stringify(value));
        continue;
      }

      url.searchParams.append(key, `${value}`);
    }
  }
  return url.toString();
}
