/* eslint-disable*/
import { accountMetadata } from "./entities/Account";
import { contactMetadata } from "./entities/Contact";
import { ipps_caseMetadata } from "./entities/ipps_case";

export const Entities = {
  Account: "account",
  Contact: "contact",
  ipps_case: "ipps_case",
};

// Setup Metadata
// Usage: setMetadataCache(metadataCache);
export const metadataCache = {
  entities: {
    account: accountMetadata,
    contact: contactMetadata,
    ipps_case: ipps_caseMetadata,
  },
  actions: {
  }
};