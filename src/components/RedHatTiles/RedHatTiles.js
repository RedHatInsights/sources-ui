import React from 'react';

import ImageWithPlaceholder from '../TilesShared/ImageWithPlaceholder';
import TilesArray from '../TilesShared/TilesArray';

const icon = (
  <ImageWithPlaceholder className="redhat-icon" src="/apps/frontend-assets/red-hat-logos/stacked.svg" alt="red hat logo" />
);

const mapper = (type, openWizard, TileComponent) =>
  ({
    ['ansible-tower']: (
      <TileComponent
        isStacked
        key={type}
        title="Ansible Automation Platform"
        onClick={() => openWizard('ansible-tower')}
        className="tile pf-u-mr-md-on-md pf-u-mt-md pf-u-mt-0-on-md"
        icon={icon}
      />
    ),
    openshift: (
      <TileComponent
        isStacked
        key={type}
        title="OpenShift Container Platfrom"
        className="tile pf-u-mr-md-on-md pf-u-mt-md pf-u-mt-0-on-md"
        onClick={() => openWizard('openshift')}
        icon={icon}
      />
    ),
  }[type]);

const RedHatTiles = (props) => <TilesArray {...props} mapper={mapper} />;

export default RedHatTiles;
