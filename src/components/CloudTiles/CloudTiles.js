import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import ImageWithPlaceholder from '../TilesShared/ImageWithPlaceholder';
import TilesArray from '../TilesShared/TilesArray';

const messages = defineMessages({
  amazonTitle: {
    id: 'cloud.amazonTitle',
    defaultMessage: 'Amazon Web Services',
  },
  googleTitle: {
    id: 'cloud.googleTitle',
    defaultMessage: 'Google Cloud',
  },
  azureTitle: {
    id: 'cloud.azureTitle',
    defaultMessage: 'Microsoft Azure',
  },
  ibmTitle: {
    id: 'cloud.ibmTitle',
    defaultMessage: 'IBM Cloud',
  },
});

const mapper = (type, openWizard, TileComponent, intl) =>
  ({
    amazon: (
      <TileComponent
        isStacked
        key={type}
        title={intl.formatMessage(messages.amazonTitle)}
        onClick={() => openWizard('amazon')}
        className="tile pf-v6-u-mr-md pf-v6-u-mt-md"
        icon={
          <ImageWithPlaceholder
            className="provider-icon pf-v6-u-mb-sm"
            src="/apps/frontend-assets/partners-icons/aws-logomark.svg"
            alt="aws logo"
          />
        }
      />
    ),
    google: (
      <TileComponent
        isStacked
        key={type}
        title={intl.formatMessage(messages.googleTitle)}
        className="tile pf-v6-u-mr-md pf-v6-u-mt-md"
        onClick={() => openWizard('google')}
        icon={
          <ImageWithPlaceholder
            className="provider-icon pf-v6-u-mb-sm"
            src="/apps/frontend-assets/partners-icons/google-cloud-logomark.svg"
            alt="google logo"
          />
        }
      />
    ),
    azure: (
      <TileComponent
        isStacked
        key={type}
        title={intl.formatMessage(messages.azureTitle)}
        onClick={() => openWizard('azure')}
        className="tile pf-v6-u-mr-md pf-v6-u-mt-md"
        icon={
          <ImageWithPlaceholder
            className="provider-icon pf-v6-u-mb-sm"
            src="/apps/frontend-assets/partners-icons/microsoft-azure-logomark.svg"
            alt="azure logo"
          />
        }
      />
    ),
    ibm: (
      <TileComponent
        isStacked
        key={type}
        title={intl.formatMessage(messages.ibmTitle)}
        onClick={() => openWizard('ibm')}
        className="tile pf-v6-u-mr-md pf-v6-u-mt-md"
        icon={
          <ImageWithPlaceholder
            className="provider-icon pf-v6-u-mb-sm"
            src="/apps/frontend-assets/partners-icons/ibm-cloud.svg"
            alt="ibm logo"
          />
        }
      />
    ),
  })[type];

const CloudTiles = (props) => {
  const intl = useIntl();
  return <TilesArray {...props} mapper={(type, openWizard, TileComponent) => mapper(type, openWizard, TileComponent, intl)} />;
};

export default CloudTiles;
