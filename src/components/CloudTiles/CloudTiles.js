import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';
import { routes } from '../../Routes';

import { Tile } from '@patternfly/react-core/dist/esm/components/Tile/Tile';

import ImageWithPlaceholder from '../TilesShared/ImageWithPlaceholder';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import DisabledTile from '../TilesShared/DisabledTile';

const mapper = (type, openWizard, TileComponent) =>
  ({
    amazon: (
      <TileComponent
        isStacked
        key={type}
        title="Amazon Web Services"
        onClick={() => openWizard('amazon')}
        className="tile pf-u-mr-md-on-md pf-u-mt-md pf-u-mt-0-on-md"
        icon={
          <ImageWithPlaceholder
            className="provider-icon pf-u-mb-sm"
            src="/apps/frontend-assets/partners-icons/aws.svg"
            alt="aws logo"
          />
        }
      />
    ),
    google: (
      <TileComponent
        isStacked
        key={type}
        title="Google Cloud"
        className="tile pf-u-mr-md-on-md pf-u-mt-md pf-u-mt-0-on-md"
        onClick={() => openWizard('google')}
        icon={
          <ImageWithPlaceholder
            className="provider-icon pf-u-mb-sm disabled-icon"
            src="/apps/frontend-assets/partners-icons/google-cloud-short.svg"
            alt="google logo"
          />
        }
      />
    ),
    azure: (
      <TileComponent
        isStacked
        key={type}
        title="Microsoft Azure"
        onClick={() => openWizard('azure')}
        className="tile pf-u-mr-md-on-md pf-u-mt-md pf-u-mt-0-on-md"
        icon={
          <ImageWithPlaceholder
            className="provider-icon pf-u-mb-sm"
            src="/apps/frontend-assets/partners-icons/microsoft-azure-short.svg"
            alt="azure logo"
          />
        }
      />
    ),
  }[type]);

const CloudTiles = ({ setSelectedType }) => {
  const { sourceTypes } = useSelector(({ sources }) => sources, shallowEqual);
  const { push } = useHistory();
  const hasWritePermissions = useHasWritePermissions();

  const openWizard = (type) => {
    setSelectedType(type);
    push(routes.sourcesNew.path);
  };

  const TileComponent = hasWritePermissions ? Tile : DisabledTile;

  return sourceTypes
    .sort((a, b) => a.product_name.localeCompare(b.product_name))
    .map(({ name }) => mapper(name, openWizard, TileComponent));
};

CloudTiles.propTypes = {
  setSelectedType: PropTypes.func.isRequired,
};

export default CloudTiles;
