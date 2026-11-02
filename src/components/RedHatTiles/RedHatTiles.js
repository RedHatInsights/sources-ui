import { defineMessages, useIntl } from 'react-intl';
import React from 'react';

import ImageWithPlaceholder from '../TilesShared/ImageWithPlaceholder';
import TilesArray from '../TilesShared/TilesArray';

const messages = defineMessages({
  redHatLogoAlt: {
    id: 'redhatTiles.redHatLogoAlt',
    defaultMessage: 'red hat logo',
  },
  ocpTitle: {
    id: 'redhatTiles.ocpTitle',
    defaultMessage: 'OpenShift Container Platform',
  },
});

const icon = (intl) => (
  <ImageWithPlaceholder
    className="redhat-icon"
    src="/apps/frontend-assets/red-hat-logos/stacked.svg"
    alt={intl.formatMessage(messages.redHatLogoAlt)}
  />
);

const mapper = (type, openWizard, TileComponent, intl) =>
  ({
    openshift: (
      <TileComponent
        isStacked
        key={type}
        title={intl.formatMessage(messages.ocpTitle)}
        className="tile pf-v6-u-mr-md-on-md pf-v6-u-mt-md pf-v6-u-mt-0-on-md"
        onClick={() => openWizard('openshift')}
        icon={icon(intl)}
      />
    ),
  })[type];

const RedHatTiles = (props) => {
  const intl = useIntl();
  return <TilesArray {...props} mapper={(type, openWizard, TileComponent) => mapper(type, openWizard, TileComponent, intl)} />;
};

export default RedHatTiles;
