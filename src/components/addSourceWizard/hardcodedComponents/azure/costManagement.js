import React, { Fragment, useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Alert,
  ClipboardCopy,
  Content,
  ContentVariants,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';

import { MenuToggle, Select, SelectList, SelectOption } from '@patternfly/react-core';

import { HCCM_LATEST_DOCS_PREFIX, HCS_LATEST_DOCS_PREFIX } from '../../stringConstants';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import FormSpy from '@data-driven-forms/react-form-renderer/form-spy';
import { shallowEqual, useSelector } from 'react-redux';
import { HCS_APP_NAME } from '../../../../utilities/constants';
import { InfoCircleIcon } from '@patternfly/react-icons';

const CREATE_AZURE_STORAGE = `${HCCM_LATEST_DOCS_PREFIX}/html-single/integrating_microsoft_azure_data_into_cost_management/index#creating-an-azure-storage-account_adding-an-azure-int`;
const CREATE_HCS_AZURE_STORAGE = `${HCS_LATEST_DOCS_PREFIX}/html/integrating_microsoft_azure_data_into_hybrid_committed_spend/assembly-adding-azure-int-hcs#creating-an-azure-storage-account-filtered_adding-an-azure-int-hcs`;
const AZURE_CREDS_URL = `${HCCM_LATEST_DOCS_PREFIX}/html-single/integrating_microsoft_azure_data_into_cost_management/index#configuring-azure-roles_adding-an-azure-int`;
const AZURE_HCS_CREDS_URL = `${HCS_LATEST_DOCS_PREFIX}/html/integrating_microsoft_azure_data_into_hybrid_committed_spend/assembly-adding-azure-int-hcs#configuring-azure-roles-hcs_adding-an-azure-int-hcs`;
const AZURE_ROLES_URL = `${HCCM_LATEST_DOCS_PREFIX}/html-single/integrating_microsoft_azure_data_into_cost_management/index#configuring-azure-roles_adding-an-azure-int`;
const RECURRING_TASK_URL = `${HCCM_LATEST_DOCS_PREFIX}/html-single/integrating_microsoft_azure_data_into_cost_management/index#creating-daily-export-azure_adding-filtered-azure-int`;
const RECURRING_HCS_TASK_URL = `${HCS_LATEST_DOCS_PREFIX}/html/integrating_microsoft_azure_data_into_hybrid_committed_spend/assembly-adding-filtered-azure-int-hcs#creating-function-filter-azure_adding-filtered-azure-int-hcs`;
export const MANUAL_CUR_STEPS = `${HCCM_LATEST_DOCS_PREFIX}/html/integrating_microsoft_azure_data_into_cost_management/assembly-updating-int#updating-azure-int-for-rhel-metering_updating-int`;

export const ConfigureResourceGroupAndStorageAccount = () => {
  const intl = useIntl();
  const showHCS = useSelector(({ sources }) => sources.hcsEnrolled, shallowEqual);

  return (
    <Content>
      <Content component={ContentVariants.p}>
        {intl.formatMessage(
          {
            id: 'cost.azure.storageAccountDescription',
            defaultMessage:
              'Red Hat recommends creating a dedicated resource group and storage account in Azure to collect cost data and metrics for cost management. {link}',
          },
          {
            link: showHCS ? null : ( // remove when HCS docs links are available
              <Content
                key="link"
                rel="noopener noreferrer"
                target="_blank"
                component={ContentVariants.a}
                href={showHCS ? CREATE_HCS_AZURE_STORAGE : CREATE_AZURE_STORAGE}
              >
                {intl.formatMessage({
                  id: 'wizard.learnMore defaultMessage=Learn more',
                  defaultMessage: 'Learn more',
                })}
              </Content>
            ),
          },
        )}
      </Content>
      <Content component={ContentVariants.p}>
        {intl.formatMessage({
          id: 'cost.azure.storageAccountAfterDescription',
          defaultMessage: 'After configuring a resource group and storage account in the Azure portal, enter the following:',
        })}
      </Content>
    </Content>
  );
};

export const SubscriptionID = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component={ContentVariants.p}>
        {intl.formatMessage({
          id: 'cost.azure.subscriptionIdCommand',
          defaultMessage:
            'Run the following command in Cloud Shell to obtain the Subscription ID where the cost export is being stored and enter it below:',
        })}
      </Content>
      <ClipboardCopy>{`az account show --query "{ id: id }" | jq '.id' | tr -d '"'`}</ClipboardCopy>
    </Content>
  );
};

export const ConfigureRolesDescription = () => {
  const intl = useIntl();
  const showHCS = useSelector(({ sources }) => sources.hcsEnrolled, shallowEqual);
  const application = showHCS ? HCS_APP_NAME : 'Cost Management';

  const { getState } = useFormApi();
  const values = getState().values;

  return (
    <Content>
      <Content component={ContentVariants.p}>
        {intl.formatMessage(
          {
            id: 'cost.azure.dedicatedCredentials',
            defaultMessage:
              'Red Hat recommends configuring dedicated credentials to grant {application} read-only access to Azure cost data.  {link}',
          },
          {
            link: showHCS ? null : ( // remove when HCS docs links are available
              <Content
                key="link"
                rel="noopener noreferrer"
                target="_blank"
                component={ContentVariants.a}
                href={showHCS ? AZURE_HCS_CREDS_URL : AZURE_CREDS_URL}
              >
                {intl.formatMessage({
                  id: 'wizard.learnMore defaultMessage=Learn more',
                  defaultMessage: 'Learn more',
                })}
              </Content>
            ),
            application,
          },
        )}
      </Content>
      <Content component={ContentVariants.p}>
        {intl.formatMessage({
          id: 'cost.azure.createContributorRole',
          defaultMessage:
            'Run the following command in Cloud Shell to create a service principal with Cost Management Storage Account Contributor role. From the output enter the values in the fields below:',
        })}
      </Content>
      <ClipboardCopy>{`az ad sp create-for-rbac -n "CostManagement" --role "Storage Account Contributor"  --scope /subscriptions/${values?.application?.extra?.subscription_id}/resourceGroups/${values?.application?.extra?.resource_group} --query '{"tenant": tenant, "client_id": appId, "secret": password}'`}</ClipboardCopy>
    </Content>
  );
};

const InternalReaderRoleDescription = () => {
  const form = useFormApi();
  const {
    values: { authentication, application },
  } = form.getState();
  const intl = useIntl();

  let scope = application?.extra?.scope || `/subscriptions/${application?.extra?.subscription_id}`;

  if (scope.includes('billingAccounts')) {
    return (
      <Content>
        <Content component={ContentVariants.p}>
          {intl.formatMessage(
            scope.includes('enrollmentAccounts')
              ? {
                  id: 'cost.azure.setupEAReaderRole',
                  defaultMessage:
                    'Launch the Azure Enterprise Portal and give the service principal created above Administrator role on the associated account.  {link}',
                }
              : {
                  id: 'cost.azure.setupMCAReaderRole',
                  defaultMessage: `Launch the Azure Portal and give the service principal created above ${
                    scope.includes('invoiceSections')
                      ? 'Invoice section reader'
                      : `Billing ${scope.includes('billingProfiles') ? 'profile' : 'account'} reader`
                  } role.  {link}`,
                },
            {
              link: (
                <Content
                  key="link"
                  rel="noopener noreferrer"
                  target="_blank"
                  component={ContentVariants.a}
                  href={AZURE_ROLES_URL}
                >
                  {intl.formatMessage({
                    id: 'wizard.learnMore defaultMessage=Learn more',
                    defaultMessage: 'Learn more',
                  })}
                </Content>
              ),
            },
          )}
        </Content>
      </Content>
    );
  }

  return application.extra.storage_only ? null : (
    <Content>
      <Content component={ContentVariants.p}>
        {intl.formatMessage({
          id: 'cost.azure.createCostReaderRole',
          defaultMessage: 'Run the following command in Cloud Shell to create a Cost Management Reader role:',
        })}
      </Content>
      <ClipboardCopy>
        {`az role assignment create --assignee "${authentication?.username}" --role "Cost Management Reader" --scope "${scope}"`}
      </ClipboardCopy>
    </Content>
  );
};

export const ReaderRoleDescription = () => (
  <FormSpy subscription={{ values: true }}>{() => <InternalReaderRoleDescription />}</FormSpy>
);

export const ExportSchedule = () => {
  const intl = useIntl();
  const formOptions = useFormApi();
  const showHCS = useSelector(({ sources }) => sources.hcsEnrolled, shallowEqual);
  const application = formOptions.getState().values.application;

  return (
    <Content>
      <Content component={ContentVariants.p}>
        {intl.formatMessage(
          {
            id: 'cost.azure.storageAccountDescription',
            defaultMessage:
              'Create a recurring task to export cost data to your Azure storage account, where Cost Management will retrieve the data.  {link}',
          },
          {
            link: showHCS ? null : ( // remove when HCS docs links are available
              <Content
                key="link"
                rel="noopener noreferrer"
                target="_blank"
                component={ContentVariants.a}
                href={showHCS ? RECURRING_HCS_TASK_URL : RECURRING_TASK_URL}
              >
                {intl.formatMessage({
                  id: 'wizard.learnMore defaultMessage=Learn more',
                  defaultMessage: 'Learn more',
                })}
              </Content>
            ),
          },
        )}
      </Content>
      <Content className="list-align-left">
        <Content component={ContentVariants.ol}>
          <Content component={ContentVariants.li}>
            {intl.formatMessage({
              id: 'cost.azure.storageExportDescription',
              defaultMessage: 'From the Azure portal, add a new cost export.',
            })}
          </Content>
          <Content component={ContentVariants.li}>
            {intl.formatMessage({
              id: 'cost.azure.storageAccountDescription',
              defaultMessage:
                'Provide a name for the container and directory path, and specify the below settings to create the daily export. Leave all other options as the default.',
            })}
          </Content>
        </Content>
      </Content>
      <Content className="export-table" component={ContentVariants.dl}>
        <Content component={ContentVariants.dt}>
          <Content component={ContentVariants.b}>
            {intl.formatMessage({
              id: 'cost.azure.exportType',
              defaultMessage: 'Export type',
            })}
          </Content>
        </Content>
        <Content component={ContentVariants.dd}>
          {intl.formatMessage({
            id: 'cost.azure.dailyExport',
            defaultMessage: 'Daily export of month-to-date costs',
          })}
        </Content>
        <Content component={ContentVariants.dt}>
          <Content component={ContentVariants.b}>
            {intl.formatMessage({
              id: 'cost.azure.storageAccountName',
              defaultMessage: 'Storage account name',
            })}
          </Content>
        </Content>
        <Content component={ContentVariants.dd}>
          {intl.formatMessage({
            id: 'cost.azure.createdAccountName',
            defaultMessage: 'Created storage account name or existing storage account name',
          })}
        </Content>
        <Content component={ContentVariants.dt}>
          <Content component={ContentVariants.b}>
            {intl.formatMessage({
              id: 'cost.azure.resourceGroupName',
              defaultMessage: 'Resource group name',
            })}
          </Content>
        </Content>
        <Content component={ContentVariants.dd}>
          {intl.formatMessage({
            id: 'cost.azure.createdResourceGroupName',
            defaultMessage: 'Resource group for the storage account',
          })}
        </Content>
      </Content>
      {application.extra.storage_only ? null : (
        <Fragment>
          <br />
          <Content component={ContentVariants.p}>
            {intl.formatMessage({
              id: 'cost.azure.exportNameFollowup',
              defaultMessage: 'After configuring the daily export, enter the following:',
            })}
          </Content>
        </Fragment>
      )}
    </Content>
  );
};

const CostExportSelect = ({ handleSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState('Subscription');

  const clearSelection = () => {
    setSelected(null);
    setIsOpen(false);
  };

  const onSelect = (_event, selection, isPlaceholder) => {
    if (isPlaceholder) {
      clearSelection();
    } else {
      setSelected(selection);
      setIsOpen(false);
      handleSelect(selection);
    }
  };

  const toggle = (toggleRef) => (
    <MenuToggle ref={toggleRef} onClick={() => setIsOpen((prev) => !prev)} isExpanded={isOpen}>
      {selected}
    </MenuToggle>
  );
  return (
    <Select
      aria-label="Select Input"
      toggle={toggle}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      onSelect={onSelect}
      selected={selected}
      isOpen={isOpen}
    >
      <SelectList>
        <SelectOption key="subscription" value="Subscription" />
        <SelectOption key="resourceGroup" value="Resource Group" />
        <SelectOption key="management" value="Management Group" />
        <SelectOption key="billingAccount" value="Billing Account" />
        <SelectOption key="billingProfile" value="Billing Profile" />
        <SelectOption key="invoiceSection" value="Invoice Section" />
        <SelectOption key="enrollment" value="Enrollment Account" />
      </SelectList>
    </Select>
  );
};

CostExportSelect.propTypes = {
  handleSelect: PropTypes.func.isRequired,
};

const CostExportDescription = ({ selection }) => {
  const intl = useIntl();
  const selectionText = {
    Subscription: (
      <Content>
        <Content component={ContentVariants.p}>
          {intl.formatMessage({
            id: 'cost.azure.subscription',
            defaultMessage:
              'Run the following command from the Cloud Shell to obtain the Subscription ID associated with the generated cost export.',
          })}
        </Content>
        <ClipboardCopy>
          {`az account show --query "{ id: id }" | jq '.id' | tr -d '"' | awk '{print "/subscriptions/"$0}'`}
        </ClipboardCopy>
        <br />
        <Content component={ContentVariants.p}>
          {intl.formatMessage({
            id: 'cost.azure.costExportInput',
            defaultMessage: 'After running the command, enter the output in the following field:',
          })}
        </Content>
      </Content>
    ),
    'Resource Group': (
      <Content>
        <Content component={ContentVariants.p}>
          {intl.formatMessage({
            id: 'cost.azure.resourceGroup',
            defaultMessage:
              'Run the following command from the Cloud Shell, providing the Resource Group name, to obtain the Resource Group scope associated with the generated cost export.',
          })}
        </Content>
        <ClipboardCopy>{`az group show --name {ResourceGroupName} | jq .id | tr -d '"'`}</ClipboardCopy>
        <br />
        <Content component={ContentVariants.p}>
          {intl.formatMessage({
            id: 'cost.azure.costExportInput',
            defaultMessage: 'After running the command, enter the output in the following field:',
          })}
        </Content>
      </Content>
    ),
    'Billing Account': (
      <Content>
        <Content component={ContentVariants.p}>
          {intl.formatMessage({
            id: 'cost.azure.billingAccount',
            defaultMessage:
              'Run the following command from the Cloud Shell, providing the Billing Account name, to obtain the Billing Account scope associated with the generated cost export.',
          })}
        </Content>
        <ClipboardCopy>{`az billing account show --name "{billingAccountName}" | jq '.id' | tr -d '"'`}</ClipboardCopy>
        <br />
        <Content component={ContentVariants.p}>
          {intl.formatMessage({
            id: 'cost.azure.costExportInput',
            defaultMessage: 'After running the command, enter the output in the following field:',
          })}
        </Content>
      </Content>
    ),
    'Enrollment Account': (
      <Content>
        <Content component={ContentVariants.p}>
          {intl.formatMessage({
            id: 'cost.azure.enrollment',
            defaultMessage: 'enrollment.',
          })}
        </Content>
        <ClipboardCopy>
          {`az billing enrollment-account show --name "{enrollmentAccountName}" | jq '.id' | tr -d '"'`}
        </ClipboardCopy>
        <br />
        <Content component={ContentVariants.p}>
          {intl.formatMessage({
            id: 'cost.azure.costExportInput',
            defaultMessage: 'After running the command, enter the output in the following field:',
          })}
        </Content>
      </Content>
    ),
    'Management Group': (
      <Content>
        <Content component={ContentVariants.p}>
          {intl.formatMessage({
            id: 'cost.azure.management',
            defaultMessage:
              'Run the following command from the Cloud Shell, providing the Management Group name, to obtain the Management Group scope associated with the generated cost export.',
          })}
        </Content>
        <ClipboardCopy>{`az account management-group show --name "{GroupName}" | jq '.id' | tr -d '"'`}</ClipboardCopy>
        <br />
        <Content component={ContentVariants.p}>
          {intl.formatMessage({
            id: 'cost.azure.costExportInput',
            defaultMessage: 'After running the command, enter the output in the following field:',
          })}
        </Content>
      </Content>
    ),
    'Billing Profile': (
      <Content>
        <Content component={ContentVariants.p}>
          {intl.formatMessage({
            id: 'cost.azure.billingProfile',
            defaultMessage:
              'Run the following command from the Cloud Shell, providing the Billing Account name and the Billig Profile name, to obtain the Billing Profile scope associated with the generated cost export.',
          })}
        </Content>
        <ClipboardCopy>
          {`az billing profile show --account-name "{billingAccountName}" --name "{billingProfileName}" | jq '.id' | tr -d '"'`}
        </ClipboardCopy>
        <br />
        <Content component={ContentVariants.p}>
          {intl.formatMessage({
            id: 'cost.azure.costExportInput',
            defaultMessage: 'After running the command, enter the output in the following field:',
          })}
        </Content>
      </Content>
    ),
    'Invoice Section': (
      <Content>
        <Content component={ContentVariants.p}>
          {intl.formatMessage({
            id: 'cost.azure.invoiceSection',
            defaultMessage:
              'Run the following command from the Cloud Shell, providing the Billing Account name, Billing Profile name, and Invoice Section name, to obtain the Invoice Section scope associated with the generated cost export.',
          })}
        </Content>
        <ClipboardCopy>
          {`az billing invoice section show --account-name "{billingAccountName}" --profile-name "{billingProfileName}" --name "{invoiceSectionName}" | jq '.id' | tr -d '"'`}
        </ClipboardCopy>
        <br />
        <Content component={ContentVariants.p}>
          {intl.formatMessage({
            id: 'cost.azure.invoiceSectionInput',
            defaultMessage: 'After running the command, enter the output in the following field:',
          })}
        </Content>
      </Content>
    ),
  };
  return selection ? selectionText[selection] : selectionText.Subscription;
};

export const ExportScopeDescription = () => {
  const intl = useIntl();

  return (
    <Fragment>
      <Content>
        <Content component={ContentVariants.p}>
          {intl.formatMessage(
            {
              id: 'cost.azure.costExportScopeDescription',
              defaultMessage:
                'From the Azure portal, select the scope for the new cost export. If there is a need to further customize the data you want to send to Red Hat, select the manually customize option to follow the special instructions on how to. {link}',
            },
            {
              link: (
                <Fragment>
                  <br />
                  <Content
                    key="link"
                    component={ContentVariants.a}
                    href={MANUAL_CUR_STEPS}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {intl.formatMessage({
                      id: 'cost.learnMore',
                      defaultMessage: 'Learn more',
                    })}
                  </Content>
                </Fragment>
              ),
            },
          )}
        </Content>
      </Content>
    </Fragment>
  );
};

export const ExportScopeAlert = () => {
  const intl = useIntl();

  return (
    <Fragment>
      <Alert
        variant="info"
        isInline
        title={intl.formatMessage({
          id: 'cost.azure.alertTitle',
          defaultMessage:
            'If your organization is converting systems from CentOS 7 to RHEL and using hourly billing, select Include RHEL usage.',
        })}
      />
    </Fragment>
  );
};

export const ExportScope = () => {
  const intl = useIntl();
  const formOptions = useFormApi();
  const application = formOptions.getState().values.application;
  const [selection, setSelection] = useState('');
  const handleSelect = (selection = 'Subscription') => setSelection(selection);

  return application.extra.storage_only ? (
    <EmptyState
      titleText={
        <Title size="lg" headingLevel="h4">
          {intl.formatMessage({
            id: 'cost.manualTitleCUR',
            defaultMessage: 'Skip this step and proceed to next step',
          })}
        </Title>
      }
      icon={InfoCircleIcon}
      variant={EmptyStateVariant.small}
    >
      <EmptyStateBody>
        {intl.formatMessage({
          id: 'cost.manualDescriptionCUR',
          defaultMessage:
            'Since you have chosen to manually customize the data set you want to send to Cost Management, you do not need to specify an export scope at this point and time.',
        })}
      </EmptyStateBody>
    </EmptyState>
  ) : (
    <div>
      <div>
        <Title headingLevel="h6">Scope</Title>
        <CostExportSelect handleSelect={handleSelect} />
      </div>
      <br />
      <div>
        <CostExportDescription selection={selection} />
      </div>
    </div>
  );
};
