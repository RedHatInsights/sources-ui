import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { Text, TextContent, Button } from '@patternfly/react-core';
import { getSourcesApi } from '../../../../api/entities';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

export const LightHouseDescription = () => {
  const intl = useIntl();
  const [link, setLink] = useState();
  const [error, setError] = useState(null);

  const formOptions = useFormApi();

  useEffect(() => {
    getSourcesApi()
      .getLighthouseLink()
      .then(({ data }) => setLink(data?.[0]?.payload))
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        setError(
          intl.formatMessage({
            id: 'subwatch.iampolicy.subWatchConfigError',
            defaultMessage: 'There is an error with loading of the configuration. Please go back and return to this step.',
          })
        );
      });
  }, []);

  return (
    <TextContent>
      <Text>
        {intl.formatMessage({
          id: 'subwatch.lighthouse.desc',
          defaultMessage:
            "Complete configuration steps in Azure Lighthouse according to Microsoft instructions. When you're finished, return to this wizard to finish creating this Azure source.",
        })}
      </Text>
      <Button
        component="a"
        target="_blank"
        rel="noopener noreferrer"
        href={link}
        isLoading={!link}
        isDisabled={!link}
        onClick={() => {
          formOptions.change('lighthouse-clicked', true);
        }}
      >
        {intl.formatMessage({
          id: 'subwatch.lighthouse.button',
          defaultMessage: 'Take me to Lighthouse',
        })}
      </Button>
      {error}
    </TextContent>
  );
};

export const SubscriptionID = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text>
        {intl.formatMessage({
          id: 'subwatch.subscriptionId.desc',
          defaultMessage:
            'Log in to your Azure account and navigate to your subscriptions. Copy the subscription ID you wish to use and paste it into the field below.',
        })}
      </Text>
    </TextContent>
  );
};
