import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { HCCM_LATEST_DOCS_PREFIX } from '../../stringConstants';

import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

const CREATE_OCI_SCRIPT = `${HCCM_LATEST_DOCS_PREFIX}/html/integrating_oracle_cloud_data_into_cost_management/assembly-adding-oci-int#create-oci-script_adding-oci-int`;

import {
  ClipboardCopy,
  ClipboardCopyVariant,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListVariants,
  TextVariants,
  Title,
} from '@patternfly/react-core';

export const CompartmentId = ({ fields }) => {
  const intl = useIntl();
  const { renderForm } = useFormApi();

  return (
    <TextContent>
      <Title headingLevel="h1">
        {intl.formatMessage({
          id: 'cost.oci.compartmentIdStepTitle',
          defaultMessage: 'Global compartment-id',
        })}
      </Title>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'cost.oci.compartmentId.description',
          defaultMessage:
            'To collect and store the information needed to manage your costs, you need to first find your Global compartment-id.',
        })}
      </Text>
      <TextList className="pf-v5-u-ml-0 pf-v5-u-pl-md" component={TextListVariants.ol}>
        <TextListItem className="pf-v5-u-mb-lg">
          {intl.formatMessage({
            id: 'cost.oci.compartmentId.subtitle1',
            defaultMessage: 'In the Oracle Cloud shell, copy and paste this command into the terminal to list your compartments',
          })}
          <ClipboardCopy className="pf-v5-u-mt-sm">oci iam compartment list</ClipboardCopy>
        </TextListItem>
        <TextListItem>
          {intl.formatMessage({
            id: 'cost.oci.compartmentId.subtitle2',
            defaultMessage: 'Enter the name of your global compartment-id (tenant-id)',
          })}
          {fields.map((field) => (
            <div className="pf-v5-u-mt-sm" key={field.name}>
              {renderForm([field])}
            </div>
          ))}
        </TextListItem>
      </TextList>
    </TextContent>
  );
};

CompartmentId.propTypes = {
  fields: PropTypes.array.isRequired,
};

export const PolicyCompartment = ({ fields }) => {
  const intl = useIntl();

  const { renderForm, getState } = useFormApi();
  const values = getState().values;

  return (
    <TextContent>
      <Title headingLevel="h1">
        {intl.formatMessage({
          id: 'cost.oci.policyCompartmentStepTitle',
          defaultMessage: 'Create new policy and compartment',
        })}
      </Title>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'cost.oci.policyCompartment.description',
          defaultMessage:
            'In the Oracle Cloud shell, copy and paste these commands to create your cost and usage reports policy, and new cost compartment.',
        })}
      </Text>
      <TextList className="pf-v5-u-ml-0 pf-v5-u-pl-md" component={TextListVariants.ol}>
        <TextListItem className="pf-v5-u-mb-lg">
          {intl.formatMessage({
            id: 'cost.oci.policyCompartment.subtitle1',
            defaultMessage: 'Create cost and usage reports policy using the following command',
          })}
          <ClipboardCopy className="pf-v5-u-mt-sm" variant={ClipboardCopyVariant.expansion}>
            {`oci iam policy create --compartment-id ${values?.application?.extra?.compartment_id} --description "test" --name "test" --statements '["define tenancy usage-report as ocid1.tenancy.oc1..aaaaaaaaned4fkpkisbwjlr56u7cj63lf3wffbilvqknstgtvzub7vhqkggq","endorse group Administrators to read objects in tenancy usage-report"]'`}
          </ClipboardCopy>
        </TextListItem>
        <TextListItem className="pf-v5-u-mb-lg">
          {intl.formatMessage({
            id: 'cost.oci.policyCompartment.subtitle2',
            defaultMessage: 'Create new Cost management compartment',
          })}
          <ClipboardCopy className="pf-v5-u-mt-sm" variant={ClipboardCopyVariant.expansion}>
            {`oci iam compartment create --name cost-mgmt-compartment --compartment-id ${values?.application?.extra?.compartment_id} --description 'Cost management compartment for cost and usage data'`}
          </ClipboardCopy>
        </TextListItem>
        <TextListItem>
          {intl.formatMessage({
            id: 'cost.oci.policyCompartment.subtitle3',
            defaultMessage: 'Enter the name of the your new compartment-id',
          })}
          {fields.map((field) => (
            <div className="pf-v5-u-mt-sm" key={field.name}>
              {renderForm([field])}
            </div>
          ))}
        </TextListItem>
      </TextList>
    </TextContent>
  );
};

PolicyCompartment.propTypes = {
  fields: PropTypes.array.isRequired,
};

export const CreateBucket = ({ fields }) => {
  const intl = useIntl();

  const { renderForm, getState } = useFormApi();
  const values = getState().values;

  return (
    <TextContent>
      <Title headingLevel="h1">
        {intl.formatMessage({
          id: 'cost.oci.createBucketStepTitle',
          defaultMessage: 'Create bucket',
        })}
      </Title>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'cost.oci.createBucket.description',
          defaultMessage:
            'Because Oracle Cloud does not allow outside access to the usage bucket, you will need to create a new bucket to copy the necessary data into.',
        })}
      </Text>
      <TextList className="pf-v5-u-ml-0 pf-v5-u-pl-md" component={TextListVariants.ol}>
        <TextListItem className="pf-v5-u-mb-lg">
          {intl.formatMessage({
            id: 'cost.oci.createBucket.subtitle1',
            defaultMessage: 'Create a new bucket for cost and usage data with the following command',
          })}
          <ClipboardCopy className="pf-v5-u-mt-sm" variant={ClipboardCopyVariant.expansion}>
            {`oci os bucket create --name cost-management --compartment-id ${values?.application?.extra?.policy_compartment}`}
          </ClipboardCopy>
        </TextListItem>
        <TextListItem>
          {intl.formatMessage({
            id: 'cost.oci.createBucket.subtitle2',
            defaultMessage: 'Enter the name, namespace, and region of your new data bucket',
          })}
          {fields.map((field) => (
            <div className="pf-v5-u-mt-sm" key={field.name}>
              {renderForm([field])}
            </div>
          ))}
        </TextListItem>
      </TextList>
    </TextContent>
  );
};

CreateBucket.propTypes = {
  fields: PropTypes.array.isRequired,
};

export const PopulateBucket = () => {
  const intl = useIntl();

  const { getState } = useFormApi();
  const values = getState().values;

  return (
    <TextContent>
      <Title headingLevel="h1">
        {intl.formatMessage({
          id: 'cost.oci.populateBucketStepTitle',
          defaultMessage: 'Populate bucket',
        })}
      </Title>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'cost.oci.populateBucket.description',
          defaultMessage:
            'Because Oracle Cloud does not have automation scripts, you will need to create a VM to run a script that copies the necessary data to your new cost-management bucket and grant read access to Red Hat.',
        })}
      </Text>
      <TextList className="pf-v5-u-ml-0 pf-v5-u-pl-md" component={TextListVariants.ol}>
        <TextListItem className="pf-v5-u-mb-lg">
          {intl.formatMessage({
            id: 'cost.oci.populateBucket.subtitle1',
            defaultMessage:
              'In your Oracle Cloud account, create a VM and run a script similar to the one from this github repository:',
          })}
          <a className="pf-v5-u-mt-md pf-v5-u-display-block" href={CREATE_OCI_SCRIPT} target="_blank" rel="noreferrer">
            {CREATE_OCI_SCRIPT}
            <i className="pf-v5-u-ml-xs fas fa-external-link-alt pf-v5-u-font-size-xs"></i>
          </a>
        </TextListItem>
        <TextListItem className="pf-v5-u-mb-lg">
          {intl.formatMessage({
            id: 'cost.oci.populateBucket.subtitle2',
            defaultMessage: 'In your Oracle Cloud shell, create this read policy for the new bucket',
          })}
          <ClipboardCopy className="pf-v5-u-mt-sm" variant={ClipboardCopyVariant.expansion}>
            {`oci iam policy create --compartment-id ${values?.application?.extra?.compartment_id} --description 'Grant cost management bucket read access' --name Cost-managment-bucket-read --statements '["Define tenancy SourceTenancy as ocid1.tenancy.oc1..aaaaaaaa7bmeqn34urxue57x75fg4nlzh4w6ttjxckhaue2itbefeen2gdma","Define group StorageAdmins as ocid1.group.oc1..aaaaaaaamwx3swyherxtnvtq3vjmcflmteojw6lxf5i6bgwjygq642a2ejpa","Admit group StorageAdmins of tenancy SourceTenancy to read objects in tenancy"]'`}
          </ClipboardCopy>
        </TextListItem>
      </TextList>
    </TextContent>
  );
};

PopulateBucket.propTypes = {
  fields: PropTypes.array.isRequired,
};
