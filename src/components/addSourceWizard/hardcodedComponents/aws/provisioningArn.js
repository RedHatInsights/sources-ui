import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useFormApi } from '@data-driven-forms/react-form-renderer';
import {
  Alert,
  Button,
  ClipboardCopy,
  Content,
  ContentVariants,
  ExpandableSection,
  ListComponent,
  Stack,
  StackItem,
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
      <Content>
        <Content component={ContentVariants.p}>
          <FormattedMessage id="provisioning.iam.loading" defaultMessage="Loading configuration..." />
        </Content>
      </Content>
    );
  }

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Content component="p">
            <FormattedMessage
              defaultMessage="To integrate your AWS account with our service, you need to create an IAM role."
              id="provisioning.aws-role-creation.desc"
            />
          </Content>
        </StackItem>
        <StackItem>
          <ExpandableSection isIndented toggleText="See role permissions">
            <Content component="p">
              <Content component="dl">
                <Content component="li">IAM:GetPolicyVersion</Content>
                <Content component="li">IAM:GetPolicy</Content>
                <Content component="li">IAM:ListAttachedRolePolicies</Content>
                <Content component="li">IAM:GetRolePolicy</Content>
                <Content component="li">IAM:ListRolePolicies</Content>
                <Content component="li">EC2:CreateKeyPair</Content>
                <Content component="li">EC2:CreateLaunchTemplate</Content>
                <Content component="li">EC2:CreateLaunchTemplateVersion</Content>
                <Content component="li">EC2:CreateTags</Content>
                <Content component="li">EC2:DeleteKeyPair</Content>
                <Content component="li">EC2:DeleteTags</Content>
                <Content component="li">EC2:DescribeAvailabilityZones</Content>
                <Content component="li">EC2:DescribeImages</Content>
                <Content component="li">EC2:DescribeInstanceTypes</Content>
                <Content component="li">EC2:DescribeInstances</Content>
                <Content component="li">EC2:DescribeKeyPairs</Content>
                <Content component="li">EC2:DescribeLaunchTemplates</Content>
                <Content component="li">EC2:DescribeLaunchTemplateVersions</Content>
                <Content component="li">EC2:DescribeRegions</Content>
                <Content component="li">EC2:DescribeSecurityGroups</Content>
                <Content component="li">EC2:DescribeSnapshotAttribute</Content>
                <Content component="li">EC2:DescribeTags</Content>
                <Content component="li">EC2:ImportKeyPair</Content>
                <Content component="li">EC2:RunInstances</Content>
                <Content component="li">EC2:StartInstances</Content>
              </Content>
            </Content>
          </ExpandableSection>
        </StackItem>
        <StackItem>
          <Content>
            <FormattedMessage
              id="provisioning.aws-role-creation-follow.desc"
              defaultMessage="Follow these steps to create the role:"
            />
          </Content>
        </StackItem>
        <StackItem>
          <Content>
            <Content component={ListComponent.ol}>
              <Content component="li">
                <FormattedMessage
                  id="provisioning.aws-role-step-1"
                  defaultMessage="Click on {connectAWS} to open AWS CloudFormation in a new tab with the IAM Role template."
                  values={{ connectAWS: <strong>&apos;Connect AWS&apos;</strong> }}
                />
              </Content>
              <Content component="li">
                <FormattedMessage
                  id="provisioning.aws-role-step-2"
                  defaultMessage="In AWS CloudFormation, click {createStack} to initiate the creation of the IAM Role. Wait until the status shows {status}."
                  values={{
                    createStack: <strong>&apos;Create Stack&apos;</strong>,
                    status: <strong>CREATE_COMPLETE</strong>,
                  }}
                />
              </Content>
              <Content component="li">
                <FormattedMessage
                  id="provisioning.aws-role-step-3"
                  defaultMessage="Return to this window and click {next} to retrieve the new Role's ARN."
                  values={{ next: <strong>&apos;Next&apos;</strong> }}
                />
              </Content>
            </Content>
          </Content>
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
    <Content>
      <Content component="p">
        <FormattedMessage
          id="provisioning.aws-account-number.desc"
          defaultMessage="Login to your AWS account and copy your account number"
        />
      </Content>
    </Content>
  );
};

export const ArnDescription = () => {
  const formApi = useFormApi().getState();
  const accountNumber = formApi.values.meta.account;

  return (
    <Content>
      <Content component={ContentVariants.p}>
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
      </Content>
    </Content>
  );
};
