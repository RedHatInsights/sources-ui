import React from 'react';
import { FormattedMessage } from 'react-intl';
import { CLOUD_VENDOR, getActiveVendor } from '../../utilities/constants';

export const wizardDescription = () =>
  getActiveVendor() === CLOUD_VENDOR ? (
    <FormattedMessage
      id="wizard.wizardDescriptionCloud"
      defaultMessage="Register your provider to manage your Red Hat products in the cloud."
    />
  ) : (
    <FormattedMessage
      id="wizard.wizardDescriptionRedhat"
      defaultMessage="Configure a data source to connect to your Red Hat applications."
    />
  );
export const wizardTitle = () =>
  getActiveVendor() === CLOUD_VENDOR ? (
    <FormattedMessage id="wizard.wizardTitleCloud" defaultMessage="Add a cloud source" />
  ) : (
    <FormattedMessage id="wizard.wizardTitleRedhat" defaultMessage="Add Red Hat source" />
  );
export const HCCM_DOCS_PREFIX = 'https://access.redhat.com/documentation/en-us/openshift_container_platform/4.6';

export const NO_APPLICATION_VALUE = 'no-application';
