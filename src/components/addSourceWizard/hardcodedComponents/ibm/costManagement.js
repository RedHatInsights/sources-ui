import React from 'react';
import { useIntl } from 'react-intl';

import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

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
      <Title headingLevel="h1">
        {intl.formatMessage({
          id: 'cost.ibm.enterpriseIdStepTitle',
          defaultMessage: "Add the account's enterprise ID",
        })}
      </Title>
      <Content component={ContentVariants.p}>
        {intl.formatMessage({
          id: 'cost.ibm.enterpriseIdDescription',
          defaultMessage:
            'Login to the IBM Cloud Shell and run the following command. Paste the output string into the form field below.',
        })}
      </Content>
      <ClipboardCopy>ibmcloud enterprise show --output JSON | jq -r .id</ClipboardCopy>
    </Content>
  );
};

export const AccountId = () => {
  const intl = useIntl();

  return (
    <Content>
      <Title headingLevel="h1">
        {intl.formatMessage({
          id: 'cost.ibm.accountIdStepTitle',
          defaultMessage: 'Add the account ID',
        })}
      </Title>
      <Content component={ContentVariants.p}>
        {intl.formatMessage({
          id: 'cost.ibm.accountIdDescription',
          defaultMessage:
            'In the IBM Cloud Shell, run the following command. Paste the output string into the form fields below.',
        })}
      </Content>
      <ClipboardCopy>ibmcloud account show --output JSON | jq -r .account_id</ClipboardCopy>
    </Content>
  );
};

export const ServiceId = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component={ContentVariants.p}>
        {intl.formatMessage({
          id: 'cost.ibm.serviceIdDescription',
          defaultMessage:
            'Create a service ID, which Cost Management will use to get billing and usage information from your account. In the IBM Cloud Shell, run the following command. Paste the output string into the form field below.',
        })}
      </Content>
      <ClipboardCopy variant="expansion">
        {'ibmcloud iam service-id-create "Cost Management" -d "Service ID for cloud.redhat.com Cost Management" | jq -r .id'}
      </ClipboardCopy>
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
      <Content component={ContentVariants.p}>
        {intl.formatMessage({
          id: 'cost.ibm.accessDescription',
          defaultMessage:
            'Assign policies to the service ID you just created so that Cost Management will have access to account management, billing and usage service APIs.  In the IBM Cloud Shell, run the following command:',
        })}
      </Content>
      <InputGroup>
        <TextArea
          rows={6}
          value={value}
          name="service-id-commands"
          id="service-id-commands"
          aria-label={intl.formatMessage({ id: 'ibm.cost.textarea', defaultMessage: 'Commands to create policies.' })}
          spellCheck="false"
          autoCorrect="off"
        />
        <ClipboardCopyButton
          onClick={(e) => clipboardCopyFunc(e, value)}
          id="copy-service-id-commands"
          aria-label={intl.formatMessage({ id: 'ibm.cost.copy', defaultMessage: 'Copy to clipboard' })}
        >
          {intl.formatMessage({ id: 'ibm.cost.copy', defaultMessage: 'Copy to clipboard' })}
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
      <Content component={ContentVariants.p}>
        {intl.formatMessage({
          id: 'cost.ibm.apiKeyDescription',
          defaultMessage: 'In the IBM Cloud Shell, run the following command. Paste the output string into the form field below.',
        })}
      </Content>
      <ClipboardCopy variant="expansion">
        {`ibmcloud iam service-api-key-create "Cost Management API Key" "${serviceId}" -d "Cost Management Service ID API Key" --output JSON | jq -r .apikey`}
      </ClipboardCopy>
    </Content>
  );
};
