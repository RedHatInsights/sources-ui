import React from 'react';
import { useIntl } from 'react-intl';

import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

import { Text, TextVariants, TextContent, ClipboardCopy, Title } from '@patternfly/react-core';

export const EnterpriseId = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Title headingLevel="h1">
        {intl.formatMessage({
          id: 'cost.ibm.enterpriseIdStepTitle',
          defaultMessage: "Add the account's enterprise ID",
        })}
      </Title>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'cost.ibm.enterpriseIdDescription',
          defaultMessage:
            'Login to the IBM Cloud Shell and run the following command. Paste the output string into the form field below.',
        })}
      </Text>
      <ClipboardCopy>ibmcloud enterprise show --output JSON | jq -r .id</ClipboardCopy>
    </TextContent>
  );
};

export const AccountId = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Title headingLevel="h1">
        {intl.formatMessage({
          id: 'cost.ibm.accountIdStepTitle',
          defaultMessage: 'Add the account ID',
        })}
      </Title>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'cost.ibm.accountIdDescription',
          defaultMessage:
            'In the IBM Cloud Shell, run the following command. Paste the output string into the form fields below.',
        })}
      </Text>
      <ClipboardCopy>ibmcloud account show --output JSON | jq -r .account_id</ClipboardCopy>
    </TextContent>
  );
};

export const ServiceId = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'cost.ibm.serviceIdDescription',
          defaultMessage:
            'Create a service ID, which Cost Management will use to get billing and usage information from your account. In the IBM Cloud Shell, run the following command. Paste the output string into the form field below.',
        })}
      </Text>
      <ClipboardCopy variant="expansion">
        {'ibmcloud iam service-id-create "Cost Management" -d "Service ID for cloud.redhat.com Cost Management" | jq -r .id'}
      </ClipboardCopy>
    </TextContent>
  );
};

export const ConfigureAccess = () => {
  const intl = useIntl();

  const formOptions = useFormApi();

  const values = formOptions.getState().values;
  const serviceId = values.cost.service_id;

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'cost.ibm.accessDescription',
          defaultMessage:
            'Assign policies to the service ID you just created so that Cost Management will have access to account management, billing and usage service APIs.  In the IBM Cloud Shell, run the following command:',
        })}
      </Text>
      <ClipboardCopy isCode variant="expansion">
        {`ibmcloud iam service-policy-create "${serviceId}" --service-name billing  --roles Viewer
ibmcloud iam service-policy-create "${serviceId}" --account-management --roles Viewer
ibmcloud iam service-policy-create "${serviceId}" --service-name enterprise --roles "Usage Report Viewer"
ibmcloud iam service-policy-create "${serviceId}" --service-name globalcatalog  --roles Viewer`}
      </ClipboardCopy>
    </TextContent>
  );
};

export const ApiKey = () => {
  const intl = useIntl();

  const formOptions = useFormApi();

  const values = formOptions.getState().values;
  const serviceId = values.cost.service_id;

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'cost.ibm.apiKeyDescription',
          defaultMessage: 'In the IBM Cloud Shell, run the following command. Paste the output string into the form field below.',
        })}
      </Text>
      <ClipboardCopy variant="expansion">
        {`ibmcloud iam service-api-key-create "Cost Management API Key" "${serviceId}" -d "Cost Management Service ID API Key" --output JSON | jq -r .apikey`}
      </ClipboardCopy>
    </TextContent>
  );
};
