import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

const IBM_ENTERPRISE_ID_CMD = 'ibmcloud enterprise show --output JSON | jq -r .id';
const IBM_ACCOUNT_ID_CMD = 'ibmcloud account show --output JSON | jq -r .account_id';
const IBM_SERVICE_ID_CMD =
  'ibmcloud iam service-id-create "Cost Management" -d "Service ID for cloud.redhat.com Cost Management" | jq -r .id';

const messages = defineMessages({
  costIbmEnterpriseidsteptitle: {
    id: 'cost.ibm.enterpriseIdStepTitle',
    defaultMessage: "Add the account's enterprise ID",
  },
  costIbmEnterpriseiddescription: {
    id: 'cost.ibm.enterpriseIdDescription',
    defaultMessage:
      'Login to the IBM Cloud Shell and run the following command. Paste the output string into the form field below.',
  },
  costIbmAccountidsteptitle: {
    id: 'cost.ibm.accountIdStepTitle',
    defaultMessage: 'Add the account ID',
  },
  costIbmAccountiddescription: {
    id: 'cost.ibm.accountIdDescription',
    defaultMessage: 'In the IBM Cloud Shell, run the following command. Paste the output string into the form fields below.',
  },
  costIbmServiceiddescription: {
    id: 'cost.ibm.serviceIdDescription',
    defaultMessage:
      'Create a service ID, which Cost Management will use to get billing and usage information from your account. In the IBM Cloud Shell, run the following command. Paste the output string into the form field below.',
  },
  costIbmAccessdescription: {
    id: 'cost.ibm.accessDescription',
    defaultMessage:
      'Assign policies to the service ID you just created so that Cost Management will have access to account management, billing and usage service APIs.  In the IBM Cloud Shell, run the following command:',
  },
  ibmCostTextarea: {
    id: 'ibm.cost.textarea',
    defaultMessage: 'Commands to create policies.',
  },
  ibmCostCopy: {
    id: 'ibm.cost.copy',
    defaultMessage: 'Copy to clipboard',
  },
  costIbmApikeydescription: {
    id: 'cost.ibm.apiKeyDescription',
    defaultMessage: 'In the IBM Cloud Shell, run the following command. Paste the output string into the form field below.',
  },
});

import {
  ClipboardCopy,
  ClipboardCopyButton,
  Content,
  ContentVariants,
  InputGroup,
  TextArea,
  Title,
  clipboardCopyFunc,
} from '@patternfly/react-core';

export const EnterpriseId = () => {
  const intl = useIntl();

  return (
    <Content>
      <Title headingLevel="h1">{intl.formatMessage(messages.costIbmEnterpriseidsteptitle)}</Title>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.costIbmEnterpriseiddescription)}</Content>
      <ClipboardCopy>{IBM_ENTERPRISE_ID_CMD}</ClipboardCopy>
    </Content>
  );
};

export const AccountId = () => {
  const intl = useIntl();

  return (
    <Content>
      <Title headingLevel="h1">{intl.formatMessage(messages.costIbmAccountidsteptitle)}</Title>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.costIbmAccountiddescription)}</Content>
      <ClipboardCopy>{IBM_ACCOUNT_ID_CMD}</ClipboardCopy>
    </Content>
  );
};

export const ServiceId = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.costIbmServiceiddescription)}</Content>
      <ClipboardCopy variant="expansion">{IBM_SERVICE_ID_CMD}</ClipboardCopy>
    </Content>
  );
};

export const ConfigureAccess = () => {
  const intl = useIntl();

  const formOptions = useFormApi();

  const values = formOptions.getState().values;
  const serviceId = values.cost.service_id;

  const value = `ibmcloud iam service-policy-create "${serviceId}" --service-name billing  --roles Viewer
ibmcloud iam service-policy-create "${serviceId}" --account-management --roles Viewer
ibmcloud iam service-policy-create "${serviceId}" --service-name enterprise --roles "Usage Report Viewer"
ibmcloud iam service-policy-create "${serviceId}" --service-name globalcatalog  --roles Viewer`;

  return (
    <Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.costIbmAccessdescription)}</Content>
      <InputGroup>
        <TextArea
          rows={6}
          value={value}
          name="service-id-commands"
          id="service-id-commands"
          aria-label={intl.formatMessage(messages.ibmCostTextarea)}
          spellCheck="false"
          autoCorrect="off"
        />
        <ClipboardCopyButton
          onClick={(e) => clipboardCopyFunc(e, value)}
          id="copy-service-id-commands"
          aria-label={intl.formatMessage(messages.ibmCostCopy)}
        >
          {intl.formatMessage(messages.ibmCostCopy)}
        </ClipboardCopyButton>
      </InputGroup>
    </Content>
  );
};

export const ApiKey = () => {
  const intl = useIntl();

  const formOptions = useFormApi();

  const values = formOptions.getState().values;
  const serviceId = values.cost.service_id;

  return (
    <Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.costIbmApikeydescription)}</Content>
      <ClipboardCopy variant="expansion">
        {`ibmcloud iam service-api-key-create "Cost Management API Key" "${serviceId}" -d "Cost Management Service ID API Key" --output JSON | jq -r .apikey`}
      </ClipboardCopy>
    </Content>
  );
};
