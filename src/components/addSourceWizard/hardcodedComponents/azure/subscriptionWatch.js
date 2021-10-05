import React from 'react';
import { useIntl } from 'react-intl';

import { Text, TextVariants, TextContent, ClipboardCopy } from '@patternfly/react-core';

export const ObtainIDS = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text>
        {intl.formatMessage({
          id: 'subwatch.azure.obtainIdsDesc',
          defaultMessage:
            'Run the following command in your Azure portal’s Cloud Shell to obtain your tenant ID and subscription ID, respectively. Paste the output strings into the form fields below.',
        })}
      </Text>
      <ClipboardCopy>{'az account show —query “{tenantId,subscsriptionId:id}” -o table'}</ClipboardCopy>
    </TextContent>
  );
};

export const IamResources = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'subwatch.azure.iamResourcesDesc',
          defaultMessage:
            'To grant Red Hat necessary account permissions, run the following commands in your Azure portal’s Cloud Shell. Paste the output role assignment ID in the field below.',
        })}
      </Text>
      <ClipboardCopy className="pf-u-mb-lg">
        {'SP_ID=$(az ad sp create —id a324bc98-081f-417e-80fd-384f9aaad2bb —query ‘objectId’ -o tsv)'}
      </ClipboardCopy>
      <ClipboardCopy className="pf-u-mb-lg">
        {
          'ROLE_DEF=$(az role definition create —role-definition \'{"assignableScopes":["/subscriptions/<customer_subscription_id>"],"permissions":[{"notActions":["*"]}],"name":"Red Hat Cloud Access"}\''
        }
      </ClipboardCopy>
      <ClipboardCopy>
        {
          // TODO
          'az role assignment create —assignee-object-id ${SP_ID} —role {ROLE_DEF} —query ‘{roleAssignmentI…'
        }
      </ClipboardCopy>
    </TextContent>
  );
};
