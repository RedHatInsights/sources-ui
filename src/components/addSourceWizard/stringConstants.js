import React from 'react';
import { FormattedMessage } from 'react-intl';
import { CLOUD_VENDOR } from '../../utilities/constants';

export const wizardDescription = (activeCategory) =>
  activeCategory === CLOUD_VENDOR ? (
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
export const wizardTitle = (activeCategory) =>
  activeCategory === CLOUD_VENDOR ? (
    <FormattedMessage id="wizard.wizardTitleCloud" defaultMessage="Add a cloud integration" />
  ) : (
    <FormattedMessage id="wizard.wizardTitleRedhat" defaultMessage="Add Red Hat integration" />
  );
export const HCCM_DOCS_PREFIX = 'https://access.redhat.com/documentation/en-us/cost_management_service/2023';
export const HCCM_LATEST_DOCS_PREFIX = 'https://access.redhat.com/documentation/en-us/cost_management_service/1-latest';
export const HCS_LATEST_DOCS_PREFIX = 'https://access.redhat.com/documentation/en-us/hybrid_committed_spend/1-latest';
export const NO_APPLICATION_VALUE = 'no-application';
