using IPPS.CaseManagement.Models;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Linq;
using System.ServiceModel;

namespace IPPS.CaseManagement.Plugins
{
    /// <summary>
    /// Sets the case number for a case entity.
    /// message: "Create",
    /// entityLogicalName: "ipps_case",
    /// stage: StageEnum.PostOperation,
    /// executionMode: ExecutionModeEnum.Synchronous,
    /// filteringAttributes: "",
    /// stepName: "PostCreate_ipps_case_Sync_SetCaseNumber",
    /// executionOrder: 10,
    /// isolationModel: IsolationModeEnum.Sandbox,
    /// Description = "Sets the case number for a case entity."
    /// </summary>
    public class SetCaseNumber : PluginBase
    {
        public SetCaseNumber(string unsecureConfiguration, string secureConfiguration)
            : base(typeof(SetCaseNumber))
        {
            // TODO: Implement your custom configuration handling            
        }

        // Entry point for custom business logic execution
        protected override void ExecuteDataversePlugin(ILocalPluginContext localPluginContext)
        {
            if (localPluginContext == null)
            {
                throw new ArgumentNullException(nameof(localPluginContext));
            }

            var context = localPluginContext.PluginExecutionContext;
            var serviceFactory = localPluginContext.OrgSvcFactory;
            var tracingService = localPluginContext.TracingService;

            // Check for the entity on which the plugin would be registered
            if (!context.InputParameters.Contains("Target") || !(context.InputParameters["Target"] is Entity))
            {
                return;
            }

            try
            {
                var target = (Entity)context.InputParameters["Target"];
                var caseEntity = target.ToEntity<ipps_case>();

                var service = localPluginContext.PluginUserService;

                // locking the auto number config record
                var autoNumberConfig = GetCustomConfiguration(service, "Case/AutoNumber") ?? throw new InvalidPluginExecutionException("Auto number configuration for cases not found.");
                service.Update(new ipps_customconfiguration
                {
                    Id = autoNumberConfig.Id,
                    ipps_description = "locking"
                });

                var (caseNumber, caseNumberValue) = GenerateCaseNumber(service);
                caseEntity.ipps_casenumber = caseNumber;

                // update the case with the generated case number
                service.Update(new ipps_case
                {
                    Id = caseEntity.Id,
                    ipps_casenumber = caseNumber
                });

                // update next number
                service.Update(new ipps_customconfiguration
                {
                    Id = autoNumberConfig.Id,
                    ipps_value = (caseNumberValue + 1).ToString(),
                    ipps_description = string.Empty
                });
            }
            catch (FaultException<OrganizationServiceFault> ex)
            {
                throw new InvalidPluginExecutionException("The following error occurred in SetCaseNumber.", ex);
            }
            catch (Exception ex)
            {
                tracingService.Trace("SetCaseNumber: error: {0}", ex.ToString());
                throw;
            }
        }

        private (string caseNumber, int caseNumberValue) GenerateCaseNumber(IOrganizationService service)
        {
            // retrieve auto number config
            var autoNumberConfig = GetCustomConfiguration(service, "Case/AutoNumber") ?? throw new InvalidPluginExecutionException("Auto number configuration for cases not found.");
            var caseNumberValue = string.IsNullOrEmpty(autoNumberConfig.ipps_value) ? 1 : int.Parse(autoNumberConfig.ipps_value);
            return ($"C-{caseNumberValue:D4}", caseNumberValue);
        }

        private ipps_customconfiguration GetCustomConfiguration(IOrganizationService service, string configName)
        {
            var query = new QueryExpression(ipps_customconfiguration.EntityLogicalName);
            query.ColumnSet.AddColumns(ipps_customconfiguration.Fields.ipps_customconfigurationId, ipps_customconfiguration.Fields.ipps_value);
            query.Criteria.AddCondition(ipps_customconfiguration.Fields.ipps_name, ConditionOperator.Equal, configName);
            query.TopCount = 1;
            query.AddOrder(ipps_customconfiguration.Fields.CreatedOn, OrderType.Descending);
            var result = service.RetrieveMultiple(query);

            return result.Entities.FirstOrDefault()?.ToEntity<ipps_customconfiguration>();
        }
    }
}
