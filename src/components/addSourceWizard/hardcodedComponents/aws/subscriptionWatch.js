import React, { useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

import {
  ClipboardCopy,
  ClipboardCopyVariant,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListVariants,
  TextVariants,
} from '@patternfly/react-core';

import { useFormApi } from '@data-driven-forms/react-form-renderer';

const b = (chunks) => <b key={`b-${chunks.length}-${Math.floor(Math.random() * 1000)}`}>{chunks}</b>;

export const IAMRoleDescription = () => {
  const intl = useIntl();
  const externalId = useMemo(() => uuidv4(), []);
  const formOptions = useFormApi();
  const { authentication = {} } = formOptions.getState().values;

  useEffect(() => {
    formOptions.change('authentication', {
      ...authentication,
      extra: { ...(authentication?.extra || {}), external_id: externalId },
    });
  }, [externalId]);

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'subwatch.iamrole.delegateAccount',
          defaultMessage: 'To delegate account access, create an IAM role to associate with your IAM policy.',
        })}
      </Text>
      <TextList component={TextListVariants.ol}>
        <TextListItem>
          {intl.formatMessage({
            id: 'subwatch.iamrole.createRole',
            defaultMessage: 'From the AWS IAM console, create a new role.',
          })}
        </TextListItem>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'subwatch.iamrole.pasteAccountID',
              defaultMessage:
                'Select <b>Another AWS account</b> from the list of trusted entities and paste the following value into the <b>Account{space}ID</b> field:',
            },
            {
              b,
              space: <React.Fragment>&nbsp;</React.Fragment>,
            },
          )}
        </TextListItem>
        <ClipboardCopy className="pf-v5-u-m-sm-on-sm" isReadOnly>
          998366406740
        </ClipboardCopy>
        <TextListItem>
          {intl.formatMessage({
            id: 'subwatch.iamrole.pasteExternalId',
            defaultMessage: 'Paste the following value in the External ID field:',
          })}
        </TextListItem>
        <ClipboardCopy className="pf-v5-u-m-sm-on-sm" isReadOnly>
          {externalId}
        </ClipboardCopy>
        <TextListItem>
          {intl.formatMessage({
            id: 'subwatch.iamrole.attachPolicy',
            defaultMessage: 'Attach the permissions policy that you just created.',
          })}
        </TextListItem>
        <TextListItem>
          {intl.formatMessage({
            id: 'subwatch.iamrole.completeProcess',
            defaultMessage: 'Complete the process to create your new role.',
          })}
        </TextListItem>
      </TextList>
      <Text component={TextVariants.p}>
        {intl.formatMessage(
          {
            id: 'subwatch.iampolicy.BDoNotCloseYourBrowserBYouWillNeedToBeLoggedInToTheIamConsoleToComputeTheNextStep',
            defaultMessage: '{bold} You will need to be logged in to the IAM console to complete the next step.',
          },
          {
            bold: (
              <b key="bold">
                {intl.formatMessage({
                  id: 'subwatch.iampolicy.dontCloseBrowser',
                  defaultMessage: 'Do not close your browser.',
                })}
              </b>
            ),
          },
        )}
      </Text>
    </TextContent>
  );
};

export const IAMPolicyDescription = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'subwatch.iampolicy.grantPermissions',
          defaultMessage:
            'To grant Red Hat access to your Amazon Web Services (AWS) subscription data, create an AWS Identity and Access Management (IAM) policy.',
        })}
      </Text>
      <TextList component={TextListVariants.ol}>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'subwatch.iampolicy.signIn',
              defaultMessage: 'Log in to the {link}.',
            },
            {
              link: (
                <a
                  key="link"
                  href="https://docs.aws.amazon.com/IAM/latest/UserGuide/console.html"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {intl.formatMessage({
                    id: 'subwatch.iampolicy.IAMconsole',
                    defaultMessage: 'AWS Identity and Management (IAM) console',
                  })}
                </a>
              ),
            },
          )}
        </TextListItem>
        <TextListItem>
          {intl.formatMessage({
            id: 'subwatch.iampolicy.createPolicty',
            defaultMessage: 'Create a new policy, pasting the following content into the JSON text box.',
          })}
        </TextListItem>
        <ClipboardCopy isCode variant={ClipboardCopyVariant.expansion} className="pf-v5-u-m-sm-on-sm" isReadOnly>
          {JSON.stringify(
            {
              Version: '2012-10-17',
              Statement: [
                {
                  Sid: 'CloudigradePolicy',
                  Effect: 'Allow',
                  Action: ['sts:GetCallerIdentity'],
                  Resource: '*',
                },
              ],
            },
            null,
            2,
          )}
        </ClipboardCopy>
        <TextListItem>
          {intl.formatMessage({
            id: 'subwatch.iampolicy.completeProcess',
            defaultMessage: 'Complete the process to create your new policy.',
          })}
        </TextListItem>
      </TextList>
      <Text component={TextVariants.p}>
        {intl.formatMessage(
          {
            id: 'subwatch.iampolicy.BDoNotCloseYourBrowserBYouWillNeedToBeLoggedInToTheIamConsoleToComputeTheNextStep',
            defaultMessage: '{bold} You will need to be logged in to the IAM console to complete the next step.',
          },
          {
            bold: (
              <b key="bold">
                {intl.formatMessage({
                  id: 'subwatch.iampolicy.dontCloseBrowser',
                  defaultMessage: 'Do not close your browser.',
                })}
              </b>
            ),
          },
        )}
      </Text>
    </TextContent>
  );
};

export const ArnDescription = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'subwatch.arn.enableAccount',
          defaultMessage: 'To enable account access, capture the ARN associated with the role you just created.',
        })}
      </Text>
      <TextList component={TextListVariants.ol}>
        <TextListItem>
          {intl.formatMessage({
            id: 'subwatch.arn.selectRole',
            defaultMessage: 'Navigate to the role that you just created. ',
          })}
        </TextListItem>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'subwatch.arn.copyArn',
              defaultMessage: 'From the <b>Summary</b> screen, copy the role ARN and paste it in the <b>ARN field</b> below.',
            },
            { b },
          )}
        </TextListItem>
      </TextList>
    </TextContent>
  );
};
