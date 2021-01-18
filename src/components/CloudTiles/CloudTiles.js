import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { routes } from '../../Routes';

import { Tile } from '@patternfly/react-core/dist/js/components/Tile/Tile';
import { Tooltip } from '@patternfly/react-core/dist/js/components/Tooltip/Tooltip';

import ImageWithPlaceholder from './ImageWithPlaceholder';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';

const DisabledTile = (props) => {
  const intl = useIntl();

  const tooltip = intl.formatMessage({
    id: 'sources.notAdminButton',
    defaultMessage: 'To perform this action, you must be granted write permissions from your Organization Administrator.',
  });

  return (
    <Tooltip content={tooltip}>
      <div className="disabled-tile-with-tooltip">
        <Tile {...props} isDisabled />
      </div>
    </Tooltip>
  );
};

const CloudTiles = ({ setSelectedType }) => {
  const { push } = useHistory();
  const hasWritePermissions = useHasWritePermissions();

  const openWizard = (type) => {
    setSelectedType(type);
    push(routes.sourcesNew.path);
  };

  const TileComponent = hasWritePermissions ? Tile : DisabledTile;

  return (
    <React.Fragment>
      <TileComponent
        isStacked
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
      <TileComponent
        isStacked
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
    </React.Fragment>
  );
};

CloudTiles.propTypes = {
  setSelectedType: PropTypes.func.isRequired,
};

export default CloudTiles;

/* USE WHEN GOOGLE IS READY
          <TileComponent
            isDisabled
            isStacked
            className="tile pf-u-mt-md pf-u-mt-0-on-md"
            title="Google Cloud"
            icon={
              <ImageWithPlaceholder
                className="provider-icon pf-u-mb-sm disabled-icon"
                src="/apps/frontend-assets/partners-icons/google-cloud-short.svg"
                alt="azure logo"
              />
            }
          />
*/
