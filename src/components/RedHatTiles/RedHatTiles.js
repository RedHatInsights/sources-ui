import React from 'react';

import ImageWithPlaceholder from '../TilesShared/ImageWithPlaceholder';
import TilesArray from '../TilesShared/TilesArray';

const icon = (
  <ImageWithPlaceholder className="redhat-icon" src="/apps/frontend-assets/red-hat-logos/stacked.svg" alt="red hat logo" />
);

const mapper = (type, openWizard, TileComponent) =>
  ({
    openshift: (
      <TileComponent
        isStacked
        key={type}
        title="OpenShift Container Platform"
        className="tile pf-v5-u-mr-md-on-md pf-v5-u-mt-md pf-v5-u-mt-0-on-md"
        onClick={() => openWizard('openshift')}
        icon={icon}
      />
    ),
  })[type];

const RedHatTiles = (props) => <TilesArray {...props} mapper={mapper} />;

export default RedHatTiles;
