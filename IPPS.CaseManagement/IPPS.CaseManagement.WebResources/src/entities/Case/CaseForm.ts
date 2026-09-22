export function onLoad(executionContext: Xrm.Events.EventContext) {
  const formContext = executionContext.getFormContext();
  console.log(formContext);
}
