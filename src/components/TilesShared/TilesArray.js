import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import { routes } from '../../routes';

import { Tile } from '@patternfly/react-core/deprecated';

import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import DisabledTile from '../TilesShared/DisabledTile';
import { filterVendorTypes } from '../../utilities/filterTypes';

const TilesArray = ({ setSelectedType, mapper }) => {
  const sourceTypes = useSelector(({ sources }) => sources.sourceTypes, shallowEqual);
  const activeCategory = useSelector(({ sources }) => sources.activeCategory);

  const appNavigate = useAppNavigate();
  const hasWritePermissions = useHasWritePermissions();

  const openWizard = (type) => {
    setSelectedType(type);
    appNavigate(routes.sourcesNew.path);
  };

  const TileComponent = hasWritePermissions ? Tile : DisabledTile;

  return sourceTypes
    .filter(filterVendorTypes(activeCategory))
    .sort((a, b) => a.product_name.localeCompare(b.product_name))
    .map(({ name }) => mapper(name, openWizard, TileComponent));
};

TilesArray.propTypes = {
  setSelectedType: PropTypes.func.isRequired,
  mapper: PropTypes.func.isRequired,
};

export default TilesArray;
