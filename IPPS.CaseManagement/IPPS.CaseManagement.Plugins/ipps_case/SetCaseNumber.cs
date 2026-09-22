using Microsoft.Xrm.Sdk;
using System;
using System.ServiceModel;

namespace IPPS.CaseManagement.Plugins
{
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
    }
}
