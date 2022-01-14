import React from 'react';
import ImageWithPlaceholder from '../TilesShared/ImageWithPlaceholder';
import TilesArray from '../TilesShared/TilesArray';

const mapper = (type, openWizard, TileComponent) =>
  ({
    amazon: (
      <TileComponent
        isStacked
        key={type}
        title="Amazon Web Services"
        onClick={() => openWizard('amazon')}
        className="tile pf-u-mr-md pf-u-mt-md"
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
        className="tile pf-u-mr-md pf-u-mt-md"
        onClick={() => openWizard('google')}
        icon={
          <ImageWithPlaceholder
            className="provider-icon pf-u-mb-sm"
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
        className="tile pf-u-mr-md pf-u-mt-md"
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

const CloudTiles = (props) => <TilesArray {...props} mapper={mapper} />;

export default CloudTiles;
