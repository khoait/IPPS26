import path from "node:path";

export const DATAVERSE_AUTH_FILE = path.join(__dirname, "../../playwright/.auth/dataverse.json");

export const USER_AUTH_FILE = path.join(__dirname, "../../playwright/.auth/user.json");

export const AppNames = {
  CASE_MANAGEMENT: "ipps_IPPSCaseManagement",
};
