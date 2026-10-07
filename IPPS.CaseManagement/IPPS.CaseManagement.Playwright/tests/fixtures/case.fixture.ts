import { test as dataverseClientTest } from "@fixtures/dataverse-client.fixture";
import { type ipps_case, ipps_caseMetadata, ipps_prioritycodes } from "../types";

export const test = dataverseClientTest.extend<{
  normalPriorityCaseId: string;
}>({
  normalPriorityCaseId: async ({ dataverseClient }, use) => {
    const caseId = await dataverseClient.create({
      logicalName: ipps_caseMetadata.logicalName,
      ipps_priority: ipps_prioritycodes.Normal,
      ipps_name: "Normal Priority Case",
      ipps_description: "This is a normal priority case.",
    } as ipps_case);

    await use(caseId);

    await dataverseClient.delete({
      logicalName: ipps_caseMetadata.logicalName,
      id: caseId,
    });
  },
});
