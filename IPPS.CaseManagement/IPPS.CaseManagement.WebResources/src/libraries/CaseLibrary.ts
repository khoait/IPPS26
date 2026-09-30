import * as CaseForm from "../entities/Case/CaseForm";
import * as CaseRibbon from "../entities/Case/CaseRibbon";

window.IPPS ??= {
  CaseManagement: {},
};

window.IPPS.CaseManagement.CaseLibrary ??= {};
window.IPPS.CaseManagement.CaseLibrary.CaseForm = CaseForm;
window.IPPS.CaseManagement.CaseLibrary.CaseRibbon = CaseRibbon;
