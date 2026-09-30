import { ipps_caseAttributes, ipps_prioritycodes } from "../../types";

export function onLoad(executionContext: Xrm.Events.EventContext) {
  const formContext = executionContext.getFormContext();
  console.log(formContext);
}

/**
 * trigger: On Form load, On change of the "Priority" field
 * @param executionContext
 */
export function setAssignedTo(executionContext: Xrm.Events.EventContext) {
  const formContext = executionContext.getFormContext();
  const priority = formContext
    .getAttribute<Xrm.Attributes.OptionSetAttribute>(ipps_caseAttributes.ipps_Priority)
    ?.getValue();

  formContext
    .getAttribute<Xrm.Attributes.LookupAttribute>(ipps_caseAttributes.ipps_assignedto)
    ?.setRequiredLevel(priority === ipps_prioritycodes.High ? "required" : "none");
}
