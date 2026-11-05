import React, { Fragment, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
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

const SUBSCRIPTION_VALUE = 'Subscription';
const RESOURCE_GROUP_VALUE = 'Resource Group';
const MANAGEMENT_GROUP_VALUE = 'Management Group';
const BILLING_ACCOUNT_VALUE = 'Billing Account';
const BILLING_PROFILE_VALUE = 'Billing Profile';
const INVOICE_SECTION_VALUE = 'Invoice Section';
const ENROLLMENT_ACCOUNT_VALUE = 'Enrollment Account';

const messages = defineMessages({
  optionSubscription: {
    id: 'cost.azure.select.subscription',
    defaultMessage: 'Subscription',
  },
  optionResourcegroup: {
    id: 'cost.azure.select.resourceGroup',
    defaultMessage: 'Resource Group',
  },
  optionManagement: {
    id: 'cost.azure.select.management',
    defaultMessage: 'Management Group',
  },
  optionBillingaccount: {
    id: 'cost.azure.select.billingAccount',
    defaultMessage: 'Billing Account',
  },
  optionBillingprofile: {
    id: 'cost.azure.select.billingProfile',
    defaultMessage: 'Billing Profile',
  },
  optionInvoicesection: {
    id: 'cost.azure.select.invoiceSection',
    defaultMessage: 'Invoice Section',
  },
  optionEnrollment: {
    id: 'cost.azure.select.enrollment',
    defaultMessage: 'Enrollment Account',
  },
  selectInputAria: {
    id: 'cost.azure.selectInputAria',
    defaultMessage: 'Select Input',
  },
  scopeTitle: {
    id: 'cost.azure.scopeTitle',
    defaultMessage: 'Scope',
  },

  costAzureSetupEaReaderRole: {
    id: 'cost.azure.setupEAReaderRole',
    defaultMessage:
      'Launch the Azure Enterprise Portal and give the service principal created above Administrator role on the associated account.  {link}',
  },
  costAzureSetupMcaInvoiceReaderRole: {
    id: 'cost.azure.setupMCAInvoiceReaderRole',
    defaultMessage: 'Launch the Azure Portal and give the service principal created above Invoice section reader role.  {link}',
  },
  costAzureSetupMcaBillingProfileReaderRole: {
    id: 'cost.azure.setupMCABillingProfileReaderRole',
    defaultMessage: 'Launch the Azure Portal and give the service principal created above Billing profile reader role.  {link}',
  },
  costAzureSetupMcaBillingAccountReaderRole: {
    id: 'cost.azure.setupMCABillingAccountReaderRole',
    defaultMessage: 'Launch the Azure Portal and give the service principal created above Billing account reader role.  {link}',
  },

  costAzureStorageaccountdescription: {
    id: 'cost.azure.storageAccountDescription',
    defaultMessage:
      'Red Hat recommends creating a dedicated resource group and storage account in Azure to collect cost data and metrics for cost management. {link}',
  },
  wizardLearnmoreDefaultmessageLearnMore: {
    id: 'wizard.learnMore defaultMessage=Learn more',
    defaultMessage: 'Learn more',
  },
  costAzureStorageaccountafterdescription: {
    id: 'cost.azure.storageAccountAfterDescription',
    defaultMessage: 'After configuring a resource group and storage account in the Azure portal, enter the following:',
  },
  costAzureSubscriptionidcommand: {
    id: 'cost.azure.subscriptionIdCommand',
    defaultMessage:
      'Run the following command in Cloud Shell to obtain the Subscription ID where the cost export is being stored and enter it below:',
  },
  costAzureDedicatedcredentials: {
    id: 'cost.azure.dedicatedCredentials',
    defaultMessage:
      'Red Hat recommends configuring dedicated credentials to grant {application} read-only access to Azure cost data.  {link}',
  },
  costAzureCreatecontributorrole: {
    id: 'cost.azure.createContributorRole',
    defaultMessage:
      'Run the following command in Cloud Shell to create a service principal with Cost Management Storage Blob Data Reader role. From the output enter the values in the fields below:',
  },
  costAzureCreatecostreaderrole: {
    id: 'cost.azure.createCostReaderRole',
    defaultMessage: 'Run the following command in Cloud Shell to create a Cost Management Reader role:',
  },
  costAzureStorageaccountdescription_1: {
    id: 'cost.azure.storageAccountExportDescription',
    defaultMessage:
      'Create a recurring task to export cost data to your Azure storage account, where Cost Management will retrieve the data.  {link}',
  },
  costAzureStorageexportdescription: {
    id: 'cost.azure.storageExportDescription',
    defaultMessage: 'From the Azure portal, add a new cost export.',
  },
  costAzureStorageaccountdescription_2: {
    id: 'cost.azure.storageAccountContainerDescription',
    defaultMessage:
      'Provide a name for the container and directory path, and specify the below settings to create the daily export. Leave all other options as the default.',
  },
  costAzureExporttype: {
    id: 'cost.azure.exportType',
    defaultMessage: 'Export type',
  },
  costAzureDailyexport: {
    id: 'cost.azure.dailyExport',
    defaultMessage: 'Daily export of month-to-date costs',
  },
  costAzureStorageaccountname: {
    id: 'cost.azure.storageAccountName',
    defaultMessage: 'Storage account name',
  },
  costAzureCreatedaccountname: {
    id: 'cost.azure.createdAccountName',
    defaultMessage: 'Created storage account name or existing storage account name',
  },
  costAzureResourcegroupname: {
    id: 'cost.azure.resourceGroupName',
    defaultMessage: 'Resource group name',
  },
  costAzureCreatedresourcegroupname: {
    id: 'cost.azure.createdResourceGroupName',
    defaultMessage: 'Resource group for the storage account',
  },
  costAzureExportnamefollowup: {
    id: 'cost.azure.exportNameFollowup',
    defaultMessage: 'After configuring the daily export, enter the following:',
  },
  costAzureSubscription: {
    id: 'cost.azure.subscription',
    defaultMessage:
      'Run the following command from the Cloud Shell to obtain the Subscription ID associated with the generated cost export.',
  },
  costAzureCostexportinput: {
    id: 'cost.azure.costExportInput',
    defaultMessage: 'After running the command, enter the output in the following field:',
  },
  costAzureResourcegroup: {
    id: 'cost.azure.resourceGroup',
    defaultMessage:
      'Run the following command from the Cloud Shell, providing the Resource Group name, to obtain the Resource Group scope associated with the generated cost export.',
  },
  costAzureBillingaccount: {
    id: 'cost.azure.billingAccount',
    defaultMessage:
      'Run the following command from the Cloud Shell, providing the Billing Account name, to obtain the Billing Account scope associated with the generated cost export.',
  },
  costAzureEnrollment: {
    id: 'cost.azure.enrollment',
    defaultMessage: 'enrollment.',
  },
  costAzureManagement: {
    id: 'cost.azure.management',
    defaultMessage:
      'Run the following command from the Cloud Shell, providing the Management Group name, to obtain the Management Group scope associated with the generated cost export.',
  },
  costAzureBillingprofile: {
    id: 'cost.azure.billingProfile',
    defaultMessage:
      'Run the following command from the Cloud Shell, providing the Billing Account name and the Billig Profile name, to obtain the Billing Profile scope associated with the generated cost export.',
  },
  costAzureInvoicesection: {
    id: 'cost.azure.invoiceSection',
    defaultMessage:
      'Run the following command from the Cloud Shell, providing the Billing Account name, Billing Profile name, and Invoice Section name, to obtain the Invoice Section scope associated with the generated cost export.',
  },
  costAzureInvoicesectioninput: {
    id: 'cost.azure.invoiceSectionInput',
    defaultMessage: 'After running the command, enter the output in the following field:',
  },
  costAzureCostexportscopedescription: {
    id: 'cost.azure.costExportScopeDescription',
    defaultMessage:
      'From the Azure portal, select the scope for the new cost export. If there is a need to further customize the data you want to send to Red Hat, select the manually customize option to follow the special instructions on how to. {link}',
  },
  costLearnmore: {
    id: 'cost.learnMore',
    defaultMessage: 'Learn more',
  },
  costAzureAlerttitle: {
    id: 'cost.azure.alertTitle',
    defaultMessage:
      'If your organization is converting systems from CentOS 7 to RHEL and using hourly billing, select Include RHEL usage.',
  },
  costManualtitlecur: {
    id: 'cost.manualTitleCUR',
    defaultMessage: 'Skip this step and proceed to next step',
  },
  costManualdescriptioncur: {
    id: 'cost.manualDescriptionCUR',
    defaultMessage:
      'Since you have chosen to manually customize the data set you want to send to Cost Management, you do not need to specify an export scope at this point and time.',
  },
});

const CREATE_AZURE_STORAGE = `${HCCM_LATEST_DOCS_PREFIX}/integrate-adding_azure_int#creating-an-azure-storage-account`;
const CREATE_HCS_AZURE_STORAGE = `${HCS_LATEST_DOCS_PREFIX}/html/integrating_microsoft_azure_data_into_hybrid_committed_spend/assembly-adding-azure-int-hcs#creating-an-azure-storage-account-filtered_adding-an-azure-int-hcs`;
const AZURE_CREDS_URL = `${HCCM_LATEST_DOCS_PREFIX}/integrate-adding_azure_int#configuring-azure-roles`;
const AZURE_HCS_CREDS_URL = `${HCS_LATEST_DOCS_PREFIX}/html/integrating_microsoft_azure_data_into_hybrid_committed_spend/assembly-adding-azure-int-hcs#configuring-azure-roles-hcs_adding-an-azure-int-hcs`;
const AZURE_ROLES_URL = `${HCCM_LATEST_DOCS_PREFIX}/integrate-adding_azure_int#configuring-azure-roles`;
const RECURRING_TASK_URL = `${HCCM_LATEST_DOCS_PREFIX}/integrate-adding_azure_int#configuring-an-azure-daily-export-schedule`;
const RECURRING_HCS_TASK_URL = `${HCS_LATEST_DOCS_PREFIX}/html/integrating_microsoft_azure_data_into_hybrid_committed_spend/assembly-adding-filtered-azure-int-hcs#creating-function-filter-azure_adding-filtered-azure-int-hcs`;
export const MANUAL_CUR_STEPS = `${HCCM_LATEST_DOCS_PREFIX}/integrate-azure_integration`;

export const ConfigureResourceGroupAndStorageAccount = () => {
  const intl = useIntl();
  const showHCS = useSelector(({ sources }) => sources.hcsEnrolled, shallowEqual);

  return (
    <Content>
      <Content component={ContentVariants.p}>
        {intl.formatMessage(messages.costAzureStorageaccountdescription, {
          link: showHCS ? null : ( // remove when HCS docs links are available
            <Content
              key="link"
              rel="noopener noreferrer"
              target="_blank"
              component={ContentVariants.a}
              href={showHCS ? CREATE_HCS_AZURE_STORAGE : CREATE_AZURE_STORAGE}
            >
              {intl.formatMessage(messages.wizardLearnmoreDefaultmessageLearnMore)}
            </Content>
          ),
        })}
      </Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureStorageaccountafterdescription)}</Content>
    </Content>
  );
};

export const SubscriptionID = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureSubscriptionidcommand)}</Content>
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
        {intl.formatMessage(messages.costAzureDedicatedcredentials, {
          link: showHCS ? null : ( // remove when HCS docs links are available
            <Content
              key="link"
              rel="noopener noreferrer"
              target="_blank"
              component={ContentVariants.a}
              href={showHCS ? AZURE_HCS_CREDS_URL : AZURE_CREDS_URL}
            >
              {intl.formatMessage(messages.wizardLearnmoreDefaultmessageLearnMore)}
            </Content>
          ),
          application,
        })}
      </Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureCreatecontributorrole)}</Content>
      <ClipboardCopy>{`az ad sp create-for-rbac -n "CostManagement" --role "Storage Blob Data Reader"  --scope /subscriptions/${values?.application?.extra?.subscription_id}/resourceGroups/${values?.application?.extra?.resource_group} --query '{"tenant": tenant, "client_id": appId, "secret": password}'`}</ClipboardCopy>
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
              ? messages.costAzureSetupEaReaderRole
              : scope.includes('invoiceSections')
                ? messages.costAzureSetupMcaInvoiceReaderRole
                : scope.includes('billingProfiles')
                  ? messages.costAzureSetupMcaBillingProfileReaderRole
                  : messages.costAzureSetupMcaBillingAccountReaderRole,
            {
              link: (
                <Content
                  key="link"
                  rel="noopener noreferrer"
                  target="_blank"
                  component={ContentVariants.a}
                  href={AZURE_ROLES_URL}
                >
                  {intl.formatMessage(messages.wizardLearnmoreDefaultmessageLearnMore)}
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
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureCreatecostreaderrole)}</Content>
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
        {intl.formatMessage(messages.costAzureStorageaccountdescription_1, {
          link: showHCS ? null : ( // remove when HCS docs links are available
            <Content
              key="link"
              rel="noopener noreferrer"
              target="_blank"
              component={ContentVariants.a}
              href={showHCS ? RECURRING_HCS_TASK_URL : RECURRING_TASK_URL}
            >
              {intl.formatMessage(messages.wizardLearnmoreDefaultmessageLearnMore)}
            </Content>
          ),
        })}
      </Content>
      <Content className="list-align-left">
        <Content component={ContentVariants.ol}>
          <Content component={ContentVariants.li}>{intl.formatMessage(messages.costAzureStorageexportdescription)}</Content>
          <Content component={ContentVariants.li}>{intl.formatMessage(messages.costAzureStorageaccountdescription_2)}</Content>
        </Content>
      </Content>
      <Content className="export-table" component={ContentVariants.dl}>
        <Content component={ContentVariants.dt}>
          <Content component={ContentVariants.b}>{intl.formatMessage(messages.costAzureExporttype)}</Content>
        </Content>
        <Content component={ContentVariants.dd}>{intl.formatMessage(messages.costAzureDailyexport)}</Content>
        <Content component={ContentVariants.dt}>
          <Content component={ContentVariants.b}>{intl.formatMessage(messages.costAzureStorageaccountname)}</Content>
        </Content>
        <Content component={ContentVariants.dd}>{intl.formatMessage(messages.costAzureCreatedaccountname)}</Content>
        <Content component={ContentVariants.dt}>
          <Content component={ContentVariants.b}>{intl.formatMessage(messages.costAzureResourcegroupname)}</Content>
        </Content>
        <Content component={ContentVariants.dd}>{intl.formatMessage(messages.costAzureCreatedresourcegroupname)}</Content>
      </Content>
      {application.extra.storage_only ? null : (
        <Fragment>
          <br />
          <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureExportnamefollowup)}</Content>
        </Fragment>
      )}
    </Content>
  );
};

const CostExportSelect = ({ handleSelect }) => {
  const intl = useIntl();
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
      aria-label={intl.formatMessage(messages.selectInputAria)}
      toggle={toggle}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      onSelect={onSelect}
      selected={selected}
      isOpen={isOpen}
    >
      <SelectList>
        <SelectOption key="{'subscription'}" value={SUBSCRIPTION_VALUE}>
          {intl.formatMessage(messages.optionSubscription)}
        </SelectOption>
        <SelectOption key="{'resourceGroup'}" value={RESOURCE_GROUP_VALUE}>
          {intl.formatMessage(messages.optionResourcegroup)}
        </SelectOption>
        <SelectOption key="{'management'}" value={MANAGEMENT_GROUP_VALUE}>
          {intl.formatMessage(messages.optionManagement)}
        </SelectOption>
        <SelectOption key="{'billingAccount'}" value={BILLING_ACCOUNT_VALUE}>
          {intl.formatMessage(messages.optionBillingaccount)}
        </SelectOption>
        <SelectOption key="{'billingProfile'}" value={BILLING_PROFILE_VALUE}>
          {intl.formatMessage(messages.optionBillingprofile)}
        </SelectOption>
        <SelectOption key="{'invoiceSection'}" value={INVOICE_SECTION_VALUE}>
          {intl.formatMessage(messages.optionInvoicesection)}
        </SelectOption>
        <SelectOption key="{'enrollment'}" value={ENROLLMENT_ACCOUNT_VALUE}>
          {intl.formatMessage(messages.optionEnrollment)}
        </SelectOption>
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
        <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureSubscription)}</Content>
        <ClipboardCopy>
          {`az account show --query "{ id: id }" | jq '.id' | tr -d '"' | awk '{print "/subscriptions/"$0}'`}
        </ClipboardCopy>
        <br />
        <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureCostexportinput)}</Content>
      </Content>
    ),
    'Resource Group': (
      <Content>
        <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureResourcegroup)}</Content>
        <ClipboardCopy>{`az group show --name {ResourceGroupName} | jq .id | tr -d '"'`}</ClipboardCopy>
        <br />
        <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureCostexportinput)}</Content>
      </Content>
    ),
    'Billing Account': (
      <Content>
        <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureBillingaccount)}</Content>
        <ClipboardCopy>{`az billing account show --name "{billingAccountName}" | jq '.id' | tr -d '"'`}</ClipboardCopy>
        <br />
        <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureCostexportinput)}</Content>
      </Content>
    ),
    'Enrollment Account': (
      <Content>
        <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureEnrollment)}</Content>
        <ClipboardCopy>
          {`az billing enrollment-account show --name "{enrollmentAccountName}" | jq '.id' | tr -d '"'`}
        </ClipboardCopy>
        <br />
        <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureCostexportinput)}</Content>
      </Content>
    ),
    'Management Group': (
      <Content>
        <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureManagement)}</Content>
        <ClipboardCopy>{`az account management-group show --name "{GroupName}" | jq '.id' | tr -d '"'`}</ClipboardCopy>
        <br />
        <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureCostexportinput)}</Content>
      </Content>
    ),
    'Billing Profile': (
      <Content>
        <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureBillingprofile)}</Content>
        <ClipboardCopy>
          {`az billing profile show --account-name "{billingAccountName}" --name "{billingProfileName}" | jq '.id' | tr -d '"'`}
        </ClipboardCopy>
        <br />
        <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureCostexportinput)}</Content>
      </Content>
    ),
    'Invoice Section': (
      <Content>
        <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureInvoicesection)}</Content>
        <ClipboardCopy>
          {`az billing invoice section show --account-name "{billingAccountName}" --profile-name "{billingProfileName}" --name "{invoiceSectionName}" | jq '.id' | tr -d '"'`}
        </ClipboardCopy>
        <br />
        <Content component={ContentVariants.p}>{intl.formatMessage(messages.costAzureInvoicesectioninput)}</Content>
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
          {intl.formatMessage(messages.costAzureCostexportscopedescription, {
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
                  {intl.formatMessage(messages.costLearnmore)}
                </Content>
              </Fragment>
            ),
          })}
        </Content>
      </Content>
    </Fragment>
  );
};

export const ExportScopeAlert = () => {
  const intl = useIntl();

  return (
    <Fragment>
      <Alert variant="info" isInline title={intl.formatMessage(messages.costAzureAlerttitle)} />
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
          {intl.formatMessage(messages.costManualtitlecur)}
        </Title>
      }
      icon={InfoCircleIcon}
      variant={EmptyStateVariant.small}
    >
      <EmptyStateBody>{intl.formatMessage(messages.costManualdescriptioncur)}</EmptyStateBody>
    </EmptyState>
  ) : (
    <div>
      <div>
        <Title headingLevel="h6">{intl.formatMessage(messages.scopeTitle)}</Title>
        <CostExportSelect handleSelect={handleSelect} />
      </div>
      <br />
      <div>
        <CostExportDescription selection={selection} />
      </div>
    </div>
  );
};
