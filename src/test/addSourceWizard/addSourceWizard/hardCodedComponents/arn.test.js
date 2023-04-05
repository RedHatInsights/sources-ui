import React from 'react';

import { screen } from '@testing-library/react';

import RendererContext from '@data-driven-forms/react-form-renderer/renderer-context';

import * as AwsArn from '../../../../components/addSourceWizard/hardcodedComponents/aws/arn';
import render from '../../__mocks__/render';
import { HCS_APP_NAME } from '../../../../utilities/constants';

describe('AWS-ARN hardcoded schemas', () => {
  it('ARN DESCRIPTION is rendered correctly', () => {
    render(<AwsArn.ArnDescription />);

    expect(
      screen.getByText('To enable account access, capture the ARN associated with the role you just created.')
    ).toBeInTheDocument();
    expect(screen.getByText('From the Roles tab, select the role you just created.')).toBeInTheDocument();
    expect(screen.getByText('From the Summary screen, copy the role ARN and paste it in the ARN field:')).toBeInTheDocument();
  });

  it('IAM POLICY is rendered correctly', () => {
    const S3_BUCKET_NAME = 'BBBUCKETTT';
    const FORM_OPTIONS = {
      getState: () => ({
        values: {
          application: {
            extra: {
              bucket: S3_BUCKET_NAME,
            },
          },
        },
      }),
    };

    render(
      <RendererContext.Provider value={{ formOptions: FORM_OPTIONS }}>
        <AwsArn.IAMPolicyDescription />
      </RendererContext.Provider>
    );

    expect(
      screen.getByText(
        'To grant permissions to the cost management report you just configured, create an AWS Identity and Access Management (IAM) policy.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Learn more')).toBeInTheDocument();
    expect(screen.getByText('Sign in to the AWS Identity and Access Management (IAM) console.')).toBeInTheDocument();
    expect(screen.getByText('Create a new policy, pasting the following content into the JSON text box.')).toBeInTheDocument();
    expect(screen.getByText('Complete the process to create your new policy.')).toBeInTheDocument();
    expect(screen.getByText('Do not close your browser.')).toBeInTheDocument();
    expect(screen.getByText('You will need to be logged in to the IAM console to complete the next step.')).toBeInTheDocument();
    expect(JSON.parse(screen.getByRole('textbox', { name: 'Copyable input' }).value)).toEqual({
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'VisualEditor0',
          Effect: 'Allow',
          Action: ['s3:Get*', 's3:List*'],
          Resource: ['arn:aws:s3:::BBBUCKETTT', 'arn:aws:s3:::BBBUCKETTT/*'],
        },
        { Sid: 'VisualEditor1', Effect: 'Allow', Action: ['s3:ListBucket', 'cur:DescribeReportDefinitions'], Resource: '*' },
      ],
    });
  });

  it('IAM POLICY returns error message when there is no S3_bucket value', () => {
    const S3_BUCKET_NAME = undefined;
    const FORM_OPTIONS = {
      getState: () => ({
        values: {
          application: {
            extra: {
              bucket: S3_BUCKET_NAME,
            },
          },
        },
      }),
    };

    render(
      <RendererContext.Provider value={{ formOptions: FORM_OPTIONS }}>
        <AwsArn.IAMPolicyDescription />
      </RendererContext.Provider>
    );

    expect(screen.getByText('Something went wrong, you are missing bucket value.')).toBeInTheDocument();
  });

  it('IAM ROLE is rendered correctly', () => {
    render(<AwsArn.IAMRoleDescription />);

    expect(
      screen.getByText('To delegate account access, create an IAM role to associate with your IAM policy.')
    ).toBeInTheDocument();
    expect(screen.getByText('From the AWS Identity Access Management console, create a new role.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Select another AWS account from the list of trusted entities and paste the following value into the Account ID field:'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Attach the permissions policy that you just created.')).toBeInTheDocument();
    expect(screen.getByText('Complete the process to create your new role.')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Copyable input' })).toHaveValue('589173575009');
  });

  it('IAM ROLE is rendered correctly for HCS', () => {
    render(<AwsArn.IAMRoleDescription showHCS />);

    expect(
      screen.getByText('To delegate account access, create an IAM role to associate with your IAM policy.')
    ).toBeInTheDocument();
    expect(screen.getByText('From the AWS Identity Access Management console, create a new role.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Select another AWS account from the list of trusted entities and paste the following value into the Account ID field:'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Attach the permissions policy that you just created.')).toBeInTheDocument();
    expect(screen.getByText('Complete the process to create your new role.')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Copyable input' })).toHaveValue('589173575009');
  });

  it('TAGS DESCRIPTION is rendered correctly for Cost Management', () => {
    render(<AwsArn.TagsDescription />);

    expect(screen.getByText('Learn more')).toBeInTheDocument();
    expect(
      screen.getByText(
        'To use tags to organize your AWS resources in the Cost Management application, activate your tags in AWS to allow them to be imported automatically.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('In the AWS Billing and Cost Management console, open the Cost Allocation Tags section.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Select the tags you want to use in the Cost Management application, and click Activate.')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'To use account aliases and organizational units in the display and filter of AWS resources, select the following'
      )
    ).toBeInTheDocument();
  });

  it('TAGS DESCRIPTION is rendered correctly for HCS', () => {
    render(<AwsArn.TagsDescription showHCS />);

    expect(screen.queryByText('Learn more')).not.toBeInTheDocument();
    expect(
      screen.getByText(
        'To use tags to organize your AWS resources in the Hybrid Committed Spend application, activate your tags in AWS to allow them to be imported automatically.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('In the AWS Billing and Cost Management console, open the Cost Allocation Tags section.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Select the tags you want to use in the Hybrid Committed Spend application, and click Activate.')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'To use account aliases and organizational units in the display and filter of AWS resources, select the following'
      )
    ).toBeInTheDocument();
  });

  it('USAGE description is rendered correctly', () => {
    render(<AwsArn.UsageDescription />);

    expect(
      screen.getByText(
        "The information Cost Management would need is your AWS account's cost and usage report (CUR). If there is a need to further customize the CUR you want to send to Cost Management, select the manually customize option and follow the special instructions on how to."
      )
    ).toBeInTheDocument();
  });

  it('USAGE description is rendered correctly for HCS', () => {
    render(<AwsArn.UsageDescription showHCS />);

    expect(
      screen.getByText(
        `The information ${HCS_APP_NAME} would need is your AWS account's cost and usage report (CUR). If there is a need to further customize the CUR you want to send to ${HCS_APP_NAME}, select the manually customize option and follow the special instructions on how to.`
      )
    ).toBeInTheDocument();
  });

  it('USAGE steps are rendered correctly', () => {
    const FORM_OPTIONS = {
      getState: () => ({
        values: {
          application: {
            extra: {
              bucket: undefined,
              storage_only: false,
            },
          },
        },
      }),
    };

    render(
      <RendererContext.Provider value={{ formOptions: FORM_OPTIONS }}>
        <AwsArn.UsageSteps />
      </RendererContext.Provider>
    );

    expect(screen.getByText('Create a cost and usage report using the following values:')).toBeInTheDocument();
    expect(screen.getByText('Report name: koku')).toBeInTheDocument();
    expect(screen.getByText('Time unit: hourly')).toBeInTheDocument();
    expect(screen.getByText('Include: Resource IDs')).toBeInTheDocument();
    expect(screen.getByText('Enable support for: RedShift, QuickSight and disable support for Athena')).toBeInTheDocument();
    expect(screen.getByText('Report path prefix: cost')).toBeInTheDocument();
    expect(screen.getByText('Compression type: GZIP')).toBeInTheDocument();
  });

  it('USAGE steps are rendered with empty state for manual CUR', () => {
    const FORM_OPTIONS = {
      getState: () => ({
        values: {
          application: {
            extra: {
              bucket: undefined,
              storage_only: true,
            },
          },
        },
      }),
    };

    render(
      <RendererContext.Provider value={{ formOptions: FORM_OPTIONS }}>
        <AwsArn.UsageSteps />
      </RendererContext.Provider>
    );

    expect(screen.getByText('Skip this step and proceed to next step')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Since you have chosen to manually customize the CUR you want to send to Cost Management, you do not need to create at this point and time.'
      )
    ).toBeInTheDocument();
    expect(screen.queryByText('Additional configuration steps')).toBeInTheDocument();
  });

  it('StorageDescription is rendered correctly', () => {
    render(<AwsArn.StorageDescription />);

    expect(
      screen.getByText('To store the cost and usage reports needed for cost management, you need to create an Amazon S3 bucket.')
    ).toBeInTheDocument();
    expect(
      screen.getByText("On AWS, specify or create an Amazon S3 bucket for your account and enter it's name below.")
    ).toBeInTheDocument();
    expect(screen.getByText('Learn more')).toBeInTheDocument();
  });

  it('StorageDescription is rendered correctly - HCS', () => {
    render(<AwsArn.StorageDescription showHCS />);

    expect(
      screen.getByText('To store the cost and usage reports needed for cost management, you need to create an Amazon S3 bucket.')
    ).toBeInTheDocument();
    expect(
      screen.getByText("On AWS, specify or create an Amazon S3 bucket for your account and enter it's name below.")
    ).toBeInTheDocument();
    expect(screen.queryByText('Learn more')).toBeNull();
  });

  it('IncludeAliasesLabel description is rendered correctly', () => {
    render(<AwsArn.IncludeAliasesLabel appendTo={document.body} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('IncludeOrgUnitsLabel description is rendered correctly', () => {
    render(<AwsArn.IncludeOrgUnitsLabel appendTo={document.body} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
