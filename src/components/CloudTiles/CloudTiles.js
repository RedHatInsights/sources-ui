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
        className="tile pf-v5-u-mr-md pf-v5-u-mt-md"
        icon={
          <ImageWithPlaceholder
            className="provider-icon pf-v5-u-mb-sm"
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
        className="tile pf-v5-u-mr-md pf-v5-u-mt-md"
        onClick={() => openWizard('google')}
        icon={
          <ImageWithPlaceholder
            className="provider-icon pf-v5-u-mb-sm"
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
        className="tile pf-v5-u-mr-md pf-v5-u-mt-md"
        icon={
          <ImageWithPlaceholder
            className="provider-icon pf-v5-u-mb-sm"
            src="/apps/frontend-assets/partners-icons/microsoft-azure-short.svg"
            alt="azure logo"
          />
        }
      />
    ),
    ibm: (
      <TileComponent
        isStacked
        key={type}
        title="IBM Cloud"
        onClick={() => openWizard('ibm')}
        className="tile pf-v5-u-mr-md pf-v5-u-mt-md"
        icon={
          <ImageWithPlaceholder
            className="provider-icon pf-v5-u-mb-sm"
            src="/apps/frontend-assets/partners-icons/ibm-cloud.svg"
            alt="ibm logo"
          />
        }
      />
    ),
    'oracle-cloud-infrastructure': (
      <TileComponent
        isStacked
        key={type}
        title="Oracle Cloud Infrastructure"
        onClick={() => openWizard('oracle-cloud-infrastructure')}
        className="tile pf-v5-u-mr-md pf-v5-u-mt-md"
        icon={
          <ImageWithPlaceholder
            className="provider-icon pf-v5-u-mb-sm"
            src="/apps/frontend-assets/partners-icons/oracle-short.svg"
            alt="oracle logo"
          />
        }
      />
    ),
  }[type]);

const CloudTiles = (props) => <TilesArray {...props} mapper={mapper} />;

export default CloudTiles;
