import { ipps_case_ipps_case_statuscode, ipps_caseAttributes } from "../../types";

export async function MarkAsResolvedCommandHandler(formContext: Xrm.FormContext) {
  const status = formContext
    .getAttribute<Xrm.Attributes.OptionSetAttribute>(ipps_caseAttributes.statuscode)
    ?.getValue();

  if (
    status === ipps_case_ipps_case_statuscode.Closed ||
    status === ipps_case_ipps_case_statuscode.Resolved ||
    status === ipps_case_ipps_case_statuscode.Inactive
  ) {
    return;
  }

  await formContext.data.save();

  const assignedTo = formContext
    .getAttribute<Xrm.Attributes.LookupAttribute>(ipps_caseAttributes.ipps_assignedto)
    ?.getValue()
    ?.at(0);

  const resolution = formContext
    .getAttribute<Xrm.Attributes.StringAttribute>(ipps_caseAttributes.ipps_resolution)
    ?.getValue();

  if (!assignedTo || !resolution) {
    Xrm.Navigation.openAlertDialog({
      title: "Resolve Case",
      text: "Assigned To and Resolution are required before marking the case as resolved.",
    });
    return;
  }

  const confirm = await Xrm.Navigation.openConfirmDialog({
    title: "Resolve Case",
    text: "Are you sure you want to mark this case as resolved?",
  });

  if (!confirm.confirmed) {
    return;
  }

  formContext
    .getAttribute<Xrm.Attributes.OptionSetAttribute>(ipps_caseAttributes.statuscode)
    ?.setValue(ipps_case_ipps_case_statuscode.Resolved);

  formContext.data.save();
}
