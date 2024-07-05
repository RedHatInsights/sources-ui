import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useFormApi } from '@data-driven-forms/react-form-renderer';
import {
  Alert,
  Button,
  ClipboardCopy,
  ExpandableSection,
  ListComponent,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextVariants,
} from '@patternfly/react-core';

import { getSourcesApi } from '../../../../api/entities';

const STACK_TEMPLATE = 'https://provisioning-public-assets.s3.amazonaws.com/AWSStack/provisioning.yml';
const ROLE_NAME = 'RH-HCC-provisioning-role';

export const IAMRoleDescription = () => {
  const [provAppTypeId, setAppTypeId] = useState();
  const [provAwsAccount, setAwsAccount] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const StackCreationURL = `https://console.aws.amazon.com/cloudformation/home#/stacks/quickcreate?templateURL=${STACK_TEMPLATE}&stackName=RH-HCC-provisioning-stack&param_RoleName=${ROLE_NAME}&param_ProvisioningAwsAccount=${provAwsAccount}&param_PolicyName=RH-HCC-provisioning-policy`;

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

  if (fetchError) {
    return (
      <Alert
        variant="warning"
        title={
          <FormattedMessage
            id="provisioning.iam.fetchError"
            defaultMessage="There was an error while loading the commands. Please go back and return to this step to try again."
          />
        }
      />
    );
  }

  if (provAwsAccount === null) {
    return (
      <TextContent>
        <Text component={TextVariants.p}>
          <FormattedMessage id="provisioning.iam.loading" defaultMessage="Loading configuration..." />
        </Text>
      </TextContent>
    );
  }

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Text>
            <FormattedMessage
              defaultMessage="To integrate your AWS account with our service, you need to create an IAM role."
              id="provisioning.aws-role-creation.desc"
            />
          </Text>
        </StackItem>
        <StackItem>
          <ExpandableSection isIndented toggleText="See role permissions">
            <Text>
              <TextList component="dl">
                <TextListItem>IAM:GetPolicyVersion</TextListItem>
                <TextListItem>IAM:GetPolicy</TextListItem>
                <TextListItem>IAM:ListAttachedRolePolicies</TextListItem>
                <TextListItem>IAM:GetRolePolicy</TextListItem>
                <TextListItem>IAM:ListRolePolicies</TextListItem>
                <TextListItem>EC2:CreateKeyPair</TextListItem>
                <TextListItem>EC2:CreateLaunchTemplate</TextListItem>
                <TextListItem>EC2:CreateLaunchTemplateVersion</TextListItem>
                <TextListItem>EC2:CreateTags</TextListItem>
                <TextListItem>EC2:DeleteKeyPair</TextListItem>
                <TextListItem>EC2:DeleteTags</TextListItem>
                <TextListItem>EC2:DescribeAvailabilityZones</TextListItem>
                <TextListItem>EC2:DescribeImages</TextListItem>
                <TextListItem>EC2:DescribeInstanceTypes</TextListItem>
                <TextListItem>EC2:DescribeInstances</TextListItem>
                <TextListItem>EC2:DescribeKeyPairs</TextListItem>
                <TextListItem>EC2:DescribeLaunchTemplates</TextListItem>
                <TextListItem>EC2:DescribeLaunchTemplateVersions</TextListItem>
                <TextListItem>EC2:DescribeRegions</TextListItem>
                <TextListItem>EC2:DescribeSecurityGroups</TextListItem>
                <TextListItem>EC2:DescribeSnapshotAttribute</TextListItem>
                <TextListItem>EC2:DescribeTags</TextListItem>
                <TextListItem>EC2:ImportKeyPair</TextListItem>
                <TextListItem>EC2:RunInstances</TextListItem>
                <TextListItem>EC2:StartInstances</TextListItem>
              </TextList>
            </Text>
          </ExpandableSection>
        </StackItem>
        <StackItem>
          <TextContent>
            <FormattedMessage
              id="provisioning.aws-role-creation-follow.desc"
              defaultMessage="Follow these steps to create the role:"
            />
          </TextContent>
        </StackItem>
        <StackItem>
          <TextContent>
            <TextList component={ListComponent.ol}>
              <TextListItem>
                <FormattedMessage
                  id="provisioning.aws-role-step-1"
                  defaultMessage="Click on {connectAWS} to open AWS CloudFormation in a new tab with the IAM Role template."
                  values={{ connectAWS: <strong>&apos;Connect AWS&apos;</strong> }}
                />
              </TextListItem>
              <TextListItem>
                <FormattedMessage
                  id="provisioning.aws-role-step-2"
                  defaultMessage="In AWS CloudFormation, click {createStack} to initiate the creation of the IAM Role. Wait until the status shows {status}."
                  values={{
                    createStack: <strong>&apos;Create Stack&apos;</strong>,
                    status: <strong>CREATE_COMPLETE</strong>,
                  }}
                />
              </TextListItem>
              <TextListItem>
                <FormattedMessage
                  id="provisioning.aws-role-step-3"
                  defaultMessage="Return to this window and click {next} to retrieve the new Role's ARN."
                  values={{ next: <strong>&apos;Next&apos;</strong> }}
                />
              </TextListItem>
            </TextList>
          </TextContent>
        </StackItem>
        <StackItem>
          <Button component="a" target="_blank" href={StackCreationURL} isBlock variant="primary">
            Connect AWS
          </Button>
        </StackItem>
      </Stack>
    </>
  );
};

export const AccountNumber = () => {
  return (
    <TextContent>
      <Text>
        <FormattedMessage
          id="provisioning.aws-account-number.desc"
          defaultMessage="Login to your AWS account and copy your account number"
        />
      </Text>
    </TextContent>
  );
};

export const ArnDescription = () => {
  const formApi = useFormApi().getState();
  const accountNumber = formApi.values.meta.account;

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        <FormattedMessage
          id="provisioning.iam.enableAccount"
          defaultMessage="To enable account access, copy this provided {ARN} and paste it into the input field below. If you modified the role name during creation, update it accordingly."
          values={{
            ARN: (
              <ClipboardCopy
                hoverTip="Copy ARN"
                clickTip="ARN Copied"
                variant="inline-compact"
              >{`arn:aws:iam::${accountNumber}:role/${ROLE_NAME}`}</ClipboardCopy>
            ),
          }}
        />
      </Text>
    </TextContent>
  );
};
