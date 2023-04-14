import React from 'react';
import { useIntl } from 'react-intl';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { Button, Text, TextContent } from '@patternfly/react-core';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

const PROVISIONING_API_BASE_V1 = `${process.env.BASE_PATH || '/api'}/provisioning/v1`;

export const LighthouseDescription = () => {
  const intl = useIntl();
  const formOptions = useFormApi();
  const { isProd } = useChrome();
  const templatePath = `${PROVISIONING_API_BASE_V1}/azure_lighthouse_template`;
  const portalLink = isProd()
    ? `https://console.redhat.com${templatePath}`
    : 'https://gist.githubusercontent.com/ezr-ondrej/eda9ef57c42083cdaaf43e58ae225ed0/raw/e31412c8d31339c14e34e0e73c87f8999336d015/stageTemplate';
  const link = `https://portal.azure.com/#create/Microsoft.Template/uri/${encodeURIComponent(portalLink)}`;

  return (
    <TextContent>
      <Text>
        {intl.formatMessage({
          id: 'provisioning.lighthouse.desc',
          defaultMessage:
            "Complete configuration steps in Azure Lighthouse according to Microsoft instructions. When you're finished, return to this wizard to finish creating this Azure source.",
        })}
      </Text>
      <Button
        component="a"
        target="_blank"
        rel="noopener noreferrer"
        href={link}
        onClick={() => {
          formOptions.change('lighthouse-clicked', true);
        }}
        isBlock
      >
        {intl.formatMessage({
          id: 'provisioning.lighthouse.button',
          defaultMessage: 'Take me to Lighthouse',
        })}
      </Button>
    </TextContent>
  );
};

export const SubscriptionID = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text>
        {intl.formatMessage({
          id: 'provisioning.subscriptionId.desc',
          defaultMessage:
            'Log in to your Azure account and navigate to your subscriptions. Copy the subscription ID you have connected through Lighthouse.',
        })}
      </Text>
    </TextContent>
  );
};
