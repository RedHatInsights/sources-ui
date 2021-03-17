import React from 'react';
import { FormattedMessage } from 'react-intl';
import { CLOUD_VENDOR } from '../../utilities/constants';

export const wizardDescription = (activeVendor) =>
  activeVendor === CLOUD_VENDOR ? (
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
export const wizardTitle = (activeVendor) =>
  activeVendor === CLOUD_VENDOR ? (
    <FormattedMessage id="wizard.wizardTitleCloud" defaultMessage="Add a cloud source" />
  ) : (
    <FormattedMessage id="wizard.wizardTitleRedhat" defaultMessage="Add Red Hat source" />
  );
export const HCCM_DOCS_PREFIX = 'https://access.redhat.com/documentation/en-us/cost_management_service/2021';

export const NO_APPLICATION_VALUE = 'no-application';
