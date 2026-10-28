import React, { useEffect, useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

import { ClipboardCopy, ClipboardCopyVariant, Content, ContentVariants } from '@patternfly/react-core';

import { useFormApi } from '@data-driven-forms/react-form-renderer';

const CLOUDIGRADE_IAM_POLICY = {
  Version: '2012-10-17',
  Statement: [
    {
      Sid: 'CloudigradePolicy',
      Effect: 'Allow',
      Action: ['sts:GetCallerIdentity'],
      Resource: '*',
    },
  ],
};

const messages = defineMessages({
  subwatchIamroleDelegateaccount: {
    id: 'subwatch.iamrole.delegateAccount',
    defaultMessage: 'To delegate account access, create an IAM role to associate with your IAM policy.',
  },
  subwatchIamroleCreaterole: {
    id: 'subwatch.iamrole.createRole',
    defaultMessage: 'From the AWS IAM console, create a new role.',
  },
  subwatchIamrolePasteaccountid: {
    id: 'subwatch.iamrole.pasteAccountID',
    defaultMessage:
      'Select <b>Another AWS account</b> from the list of trusted entities and paste the following value into the <b>Account{space}ID</b> field:',
  },
  subwatchIamrolePasteexternalid: {
    id: 'subwatch.iamrole.pasteExternalId',
    defaultMessage: 'Paste the following value in the External ID field:',
  },
  subwatchIamroleAttachpolicy: {
    id: 'subwatch.iamrole.attachPolicy',
    defaultMessage: 'Attach the permissions policy that you just created.',
  },
  subwatchIamroleCompleteprocess: {
    id: 'subwatch.iamrole.completeProcess',
    defaultMessage: 'Complete the process to create your new role.',
  },
  subwatchIampolicyBdonotcloseyourbrowserbyouwillneedtobeloggedintotheiamconsoletocomputethenextstep: {
    id: 'subwatch.iampolicy.BDoNotCloseYourBrowserBYouWillNeedToBeLoggedInToTheIamConsoleToComputeTheNextStep',
    defaultMessage: '{bold} You will need to be logged in to the IAM console to complete the next step.',
  },
  subwatchIampolicyDontclosebrowser: {
    id: 'subwatch.iampolicy.dontCloseBrowser',
    defaultMessage: 'Do not close your browser.',
  },
  subwatchIampolicyGrantpermissions: {
    id: 'subwatch.iampolicy.grantPermissions',
    defaultMessage:
      'To grant Red Hat access to your Amazon Web Services (AWS) subscription data, create an AWS Identity and Access Management (IAM) policy.',
  },
  subwatchIampolicySignin: {
    id: 'subwatch.iampolicy.signIn',
    defaultMessage: 'Log in to the {link}.',
  },
  subwatchIampolicyIamconsole: {
    id: 'subwatch.iampolicy.IAMconsole',
    defaultMessage: 'AWS Identity and Management (IAM) console',
  },
  subwatchIampolicyCreatepolicty: {
    id: 'subwatch.iampolicy.createPolicty',
    defaultMessage: 'Create a new policy, pasting the following content into the JSON text box.',
  },
  subwatchIampolicyCompleteprocess: {
    id: 'subwatch.iampolicy.completeProcess',
    defaultMessage: 'Complete the process to create your new policy.',
  },
  subwatchArnEnableaccount: {
    id: 'subwatch.arn.enableAccount',
    defaultMessage: 'To enable account access, capture the ARN associated with the role you just created.',
  },
  subwatchArnSelectrole: {
    id: 'subwatch.arn.selectRole',
    defaultMessage: 'Navigate to the role that you just created. ',
  },
  subwatchArnCopyarn: {
    id: 'subwatch.arn.copyArn',
    defaultMessage: 'From the <b>Summary</b> screen, copy the role ARN and paste it in the <b>ARN field</b> below.',
  },
});

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pre-existing pattern, see i18n cleanup ticket
  }, [externalId]);

  return (
    <Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.subwatchIamroleDelegateaccount)}</Content>
      <Content component={ContentVariants.ol}>
        <Content component="li">{intl.formatMessage(messages.subwatchIamroleCreaterole)}</Content>
        <Content component="li">
          {intl.formatMessage(messages.subwatchIamrolePasteaccountid, {
            b,
            space: <React.Fragment>&nbsp;</React.Fragment>,
          })}
        </Content>
        <ClipboardCopy className="pf-v6-u-m-sm-on-sm" isReadOnly>
          998366406740
        </ClipboardCopy>
        <Content component="li">{intl.formatMessage(messages.subwatchIamrolePasteexternalid)}</Content>
        <ClipboardCopy className="pf-v6-u-m-sm-on-sm" isReadOnly>
          {externalId}
        </ClipboardCopy>
        <Content component="li">{intl.formatMessage(messages.subwatchIamroleAttachpolicy)}</Content>
        <Content component="li">{intl.formatMessage(messages.subwatchIamroleCompleteprocess)}</Content>
      </Content>
      <Content component={ContentVariants.p}>
        {intl.formatMessage(
          messages.subwatchIampolicyBdonotcloseyourbrowserbyouwillneedtobeloggedintotheiamconsoletocomputethenextstep,
          {
            bold: <b key="bold">{intl.formatMessage(messages.subwatchIampolicyDontclosebrowser)}</b>,
          },
        )}
      </Content>
    </Content>
  );
};

export const IAMPolicyDescription = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.subwatchIampolicyGrantpermissions)}</Content>
      <Content component={ContentVariants.ol}>
        <Content component="li">
          {intl.formatMessage(messages.subwatchIampolicySignin, {
            link: (
              <a
                key="link"
                href="https://docs.aws.amazon.com/IAM/latest/UserGuide/console.html"
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage(messages.subwatchIampolicyIamconsole)}
              </a>
            ),
          })}
        </Content>
        <Content component="li">{intl.formatMessage(messages.subwatchIampolicyCreatepolicty)}</Content>
        <ClipboardCopy isCode variant={ClipboardCopyVariant.expansion} className="pf-v6-u-m-sm-on-sm" isReadOnly>
          {JSON.stringify(CLOUDIGRADE_IAM_POLICY, null, 2)}
        </ClipboardCopy>
        <Content component="li">{intl.formatMessage(messages.subwatchIampolicyCompleteprocess)}</Content>
      </Content>
      <Content component={ContentVariants.p}>
        {intl.formatMessage(
          messages.subwatchIampolicyBdonotcloseyourbrowserbyouwillneedtobeloggedintotheiamconsoletocomputethenextstep,
          {
            bold: <b key="bold">{intl.formatMessage(messages.subwatchIampolicyDontclosebrowser)}</b>,
          },
        )}
      </Content>
    </Content>
  );
};

export const ArnDescription = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.subwatchArnEnableaccount)}</Content>
      <Content component={ContentVariants.ol}>
        <Content component="li">{intl.formatMessage(messages.subwatchArnSelectrole)}</Content>
        <Content component="li">{intl.formatMessage(messages.subwatchArnCopyarn, { b })}</Content>
      </Content>
    </Content>
  );
};
