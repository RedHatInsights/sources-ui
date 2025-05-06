import React from 'react';
import { useIntl } from 'react-intl';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { Button, Content } from '@patternfly/react-core';

export const LighthouseDescription = () => {
  const intl = useIntl();
  const formOptions = useFormApi();
  const templateLink = 'https://provisioning-public-assets.s3.amazonaws.com/AzureLighthouse/offering_template.json';
  const link = `https://portal.azure.com/#create/Microsoft.Template/uri/${encodeURIComponent(templateLink)}`;

  return (
    <Content>
      <Content component="p">
        {intl.formatMessage({
          id: 'provisioning.lighthouse.desc',
          defaultMessage:
            "Complete configuration steps in Azure Lighthouse according to Microsoft instructions. When you're finished, return to this wizard to finish creating this Azure source.",
        })}
      </Content>
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
    </Content>
  );
};

export const SubscriptionID = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component="p">
        {intl.formatMessage({
          id: 'provisioning.subscriptionId.desc',
          defaultMessage:
            'Log in to your Azure account and navigate to your subscriptions. Copy the subscription ID you have connected through Lighthouse.',
        })}
      </Content>
    </Content>
  );
};
