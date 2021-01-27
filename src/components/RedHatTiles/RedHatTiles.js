import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { routes } from '../../Routes';

import { Tile } from '@patternfly/react-core/dist/js/components/Tile/Tile';

import ImageWithPlaceholder from '../TilesShared/ImageWithPlaceholder';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import DisabledTile from '../TilesShared/DisabledTile';

const RedHatTiles = ({ setSelectedType }) => {
  const { push } = useHistory();
  const hasWritePermissions = useHasWritePermissions();

  const openWizard = (type) => {
    setSelectedType(type);
    push(routes.sourcesNew.path);
  };

  const TileComponent = hasWritePermissions ? Tile : DisabledTile;

  const icon = (
    <ImageWithPlaceholder className="redhat-icon" src="/apps/frontend-assets/red-hat-logos/stacked.svg" alt="red hat logo" />
  );

  return (
    <React.Fragment>
      <TileComponent
        isStacked
        title="Ansible Automation Platform"
        onClick={() => openWizard('ansible-tower')}
        className="tile pf-u-mr-md-on-md pf-u-mt-md pf-u-mt-0-on-md"
        icon={icon}
      />
      <TileComponent
        isStacked
        title="OpenShift Container Platfrom"
        className="tile pf-u-mr-md-on-md pf-u-mt-md pf-u-mt-0-on-md"
        onClick={() => openWizard('openshift')}
        icon={icon}
      />
      <TileComponent
        isStacked
        title="Satellite"
        onClick={() => openWizard('satellite')}
        className="tile pf-u-mr-md-on-md pf-u-mt-md pf-u-mt-0-on-md"
        icon={icon}
      />
    </React.Fragment>
  );
};

RedHatTiles.propTypes = {
  setSelectedType: PropTypes.func.isRequired,
};

export default RedHatTiles;
