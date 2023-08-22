import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import {
  Alert,
  ClipboardCopy,
  ClipboardCopyVariant,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListVariants,
  TextVariants,
} from '@patternfly/react-core';

import { getSourcesApi } from '../../../../api/entities';

const ROLE_NAME = 'RH-HCC-provisioning-role';
const POLICY_COMMAND_STRING = `
POLICY_ARN=$(aws iam create-policy --policy-name RH-HCC-provisioning-policy --policy-document '{
"Version": "2012-10-17",
"Statement": [
  {
    "Sid": "RedHatProvisioning",
    "Effect": "Allow",
    "Action": [
      "iam:GetPolicyVersion",
      "iam:GetPolicy",
      "iam:ListAttachedRolePolicies",
      "iam:GetRolePolicy",
      "ec2:CreateKeyPair",
      "ec2:CreateLaunchTemplate",
      "ec2:CreateLaunchTemplateVersion",
      "ec2:CreateTags",
      "ec2:DeleteKeyPair",
      "ec2:DeleteTags",
      "ec2:DescribeAvailabilityZones",
      "ec2:DescribeImages",
      "ec2:DescribeInstanceTypes",
      "ec2:DescribeInstances",
      "ec2:DescribeKeyPairs",
      "ec2:DescribeLaunchTemplates",
      "ec2:DescribeLaunchTemplateVersions",
      "ec2:DescribeRegions",
      "ec2:DescribeSecurityGroups",
      "ec2:DescribeSnapshotAttribute",
      "ec2:DescribeTags",
      "ec2:ImportKeyPair",
      "ec2:RunInstances",
      "ec2:StartInstances",
      "iam:ListRolePolicies"
    ],
    "Resource": "*"
  }
]
}' | jq -r '.Policy.Arn')`;

const ROLE_COMMAND_STRING = `
ROLE_ARN=$(aws iam create-role --role-name ${ROLE_NAME} --assume-role-policy-document '{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Principal": {
      "AWS": "<PROVISIONING_AWS_ACCOUNT>"
    },
    "Action": "sts:AssumeRole"
  }
}' | jq -r '.Role.Arn')`;

const ATTACH_COMMAND_STRING = `aws iam attach-role-policy --role-name ${ROLE_NAME} --policy-arn $POLICY_ARN`;

export const IAMPolicyDescription = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'provisioning.iam.grantPermissions',
          defaultMessage:
            'Create the following AWS Identity and Access Management (IAM) policy to grant Red Hat permissions to run instances on your Amazon Web Services (AWS) Elastic Cloud (EC2).',
        })}
      </Text>
      <TextList component={TextListVariants.ol}>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'provisioning.iam.signIn',
              defaultMessage: 'Log in to AWS CLI by running: {awsCliCommand}.',
            },
            {
              awsCliCommand: (
                <b>
                  {intl.formatMessage({
                    id: 'provisioning.iam.signInCommand',
                    defaultMessage: 'aws configure',
                  })}
                </b>
              ),
            }
          )}
        </TextListItem>
        <TextListItem>
          {intl.formatMessage({
            id: 'provisioning.iam.createPolicty',
            defaultMessage: 'Create a new policy and store its ARN by running following command in your terminal.',
          })}
        </TextListItem>
      </TextList>
      <ClipboardCopy isCode variant={ClipboardCopyVariant.expansion} className="pf-v5-u-m-sm-on-sm" isReadOnly>
        {POLICY_COMMAND_STRING}
      </ClipboardCopy>
    </TextContent>
  );
};

export const IAMRoleDescription = () => {
  const intl = useIntl();

  const [provAppTypeId, setAppTypeId] = useState();
  const [provAwsAccount, setAwsAccount] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    getSourcesApi()
      .getProvAppType()
      .then((data) => setAppTypeId(data?.data?.[0]?.id || null))
      .catch((_e) => {
        setFetchError(true);
      });
  }, []);

  useEffect(() => {
    if (provAppTypeId) {
      getSourcesApi()
        .getProvMetadata(provAppTypeId)
        .then((data) => {
          const accID = data?.data?.[0]?.payload;
          accID ? setAwsAccount(accID) : setFetchError(true);
        })
        .catch((_e) => {
          setFetchError(true);
        });
    }
  }, [provAppTypeId]);

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'provisioning.iam.delegateAccount',
          defaultMessage: 'To delegate account access, create an IAM role and associate it with your IAM policy.',
        })}
      </Text>
      {provAwsAccount === null && fetchError === null && (
        <Text component={TextVariants.p}>
          {intl.formatMessage({ id: 'provisioning.iam.loading', defaultMessage: 'Loading configuration...' })}
        </Text>
      )}
      {fetchError && (
        <Alert
          variant="warning"
          title={intl.formatMessage({
            id: 'provisioning.iam.fetchError',
            defaultMessage: 'There was an error while loading the commands. Please go back and return to this step to try again.',
          })}
        />
      )}
      {provAwsAccount !== null && (
        <TextList component={TextListVariants.ol}>
          <TextListItem>
            {intl.formatMessage({
              id: 'provisioning.iam.createRole',
              defaultMessage: 'Create a new role and add the Red Hat account as a trusted entity and fetch the role ARN:',
            })}
            <ClipboardCopy isCode variant={ClipboardCopyVariant.expansion} className="pf-v5-u-m-sm-on-sm" isReadOnly>
              {ROLE_COMMAND_STRING.replace('<PROVISIONING_AWS_ACCOUNT>', provAwsAccount)}
            </ClipboardCopy>
          </TextListItem>
          <TextListItem>
            {intl.formatMessage({
              id: 'provisioning.iam.attachPolicy',
              defaultMessage: 'Attach the permissions policy that you just created.',
            })}
          </TextListItem>
          <ClipboardCopy isCode variant={ClipboardCopyVariant.expansion} className="pf-v5-u-m-sm-on-sm" isReadOnly>
            {ATTACH_COMMAND_STRING}
          </ClipboardCopy>
        </TextList>
      )}
    </TextContent>
  );
};

export const ArnDescription = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'provisioning.iam.enableAccount',
          defaultMessage: 'To enable account access, capture the ARN associated with the role you just created.',
        })}
      </Text>
      <TextList component={TextListVariants.ol}>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'provisioning.iam.getRoleArn',
              defaultMessage: 'Run {command} in your terminal to print the role ARN',
            },
            {
              command: <b>echo $ROLE_ARN</b>,
            }
          )}
        </TextListItem>
        <TextListItem>
          {intl.formatMessage({
            id: 'provisioning.iam.copyArn',
            defaultMessage: 'Copy it to the ARN field below.',
          })}
        </TextListItem>
      </TextList>
    </TextContent>
  );
};
