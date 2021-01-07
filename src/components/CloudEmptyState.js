/* eslint-disable react/display-name */
import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { routes } from '../Routes';

import { Card } from '@patternfly/react-core/dist/js/components/Card/Card';
import { CardBody } from '@patternfly/react-core/dist/js/components/Card/CardBody';
import { CardTitle } from '@patternfly/react-core/dist/js/components/Card/CardTitle';
import { CardFooter } from '@patternfly/react-core/dist/js/components/Card/CardFooter';
import { Text } from '@patternfly/react-core/dist/js/components/Text/Text';
import { Tile } from '@patternfly/react-core/dist/js/components/Tile/Tile';

import { ImageWithPlaceholder } from './CloudCards';

const CCSP_HREF = 'https://www.redhat.com/en/certified-cloud-and-service-providers';
const CLOUD_CATALOG_HREF = 'https://catalog.redhat.com/cloud';

const CloudEmptyState = ({ setSelectedType }) => {
  const intl = useIntl();
  const { push } = useHistory();

  const openWizard = (type) => {
    setSelectedType(type);
    push(routes.sourcesNew.path);
  };

  return (
    <Card className="pf-m-selectable pf-m-selected ins-c-sources__cloud-empty-state-card pf-u-mt-md pf-u-mt-0-on-md">
      <CardTitle>
        {intl.formatMessage({
          id: 'cloud.emptystate.cardTitle',
          defaultMessage: 'Get started by connecting to your public clouds',
        })}
      </CardTitle>
      <CardBody>
        <Text>
          {intl.formatMessage({
            id: 'cloud.emptystate.cardDescription',
            defaultMessage: 'Choose a provider to begin.',
          })}
        </Text>
        <div className="provider-tiles pf-u-mt-md pf-u-mb-lg">
          <Tile
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
          <Tile
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
          <Tile
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
        </div>
      </CardBody>
      <CardFooter className="cloud-footer">
        <Text className="ccsp-link" component="a" href={CCSP_HREF} target="_blank" rel="noopener noreferrer">
          {intl.formatMessage({
            id: 'cloud.emptystate.cccspLink',
            defaultMessage: 'See all Red Hat Certified Cloud & Service Providers',
          })}
        </Text>
        <Text className="catalog-link pf-u-mt-md">
          {intl.formatMessage(
            {
              id: 'cloud.emptystate.catalogLink',
              defaultMessage: 'Not set up with a Cloud provider? <a>Find a Cloud & Service Provider with Red Hat Ecosystem</a>',
            },
            {
              a: (chunks) => (
                <Text key="link" component="a" href={CLOUD_CATALOG_HREF} target="_blank" rel="noopener noreferrer">
                  {chunks}
                </Text>
              ),
            }
          )}
        </Text>
      </CardFooter>
    </Card>
  );
};

CloudEmptyState.propTypes = {
  setSelectedType: PropTypes.func.isRequired,
};

export default CloudEmptyState;
