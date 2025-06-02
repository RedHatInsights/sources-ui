import React from 'react';
import PropTypes from 'prop-types';
import { Tbody, Td, Tr } from '@patternfly/react-table';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Section } from '@redhat-cloud-services/frontend-components/Section';

import { Bullseye, Card, CardBody, Grid, GridItem, Spinner } from '@patternfly/react-core';

import './loaders.scss';
import { useIntl } from 'react-intl';

export const Loader = ({ width = '100%', height = '100%', className = '' }) => (
  <span className={`src-c-loader ${className}`} style={{ width, height }} role="progressbar" />
);

Loader.propTypes = {
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export const AppPlaceholder = () => {
  const intl = useIntl();

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle
          title={intl.formatMessage({
            id: 'sources.sources',
            defaultMessage: 'Integrations',
          })}
        />
      </PageHeader>
      <Section type="content">
        <div className="src-c-fake_content pf-v6-u-p-lg">
          <Loader />
        </div>
      </Section>
    </React.Fragment>
  );
};

export const PaginationLoader = () => <Loader className="top-pagination" height={30} width={200} />;

export const PlaceHolderTable = () => (
  <Bullseye className="src-c-bullseye__placeholder-loader" data-testid="placeholder-table">
    <Spinner size="xl" />
  </Bullseye>
);

export const DWPlaceHolderTable = ({ columns = 1 }) => (
  <Tbody>
    <Tr>
      <Td colSpan={columns}>
        <PlaceHolderTable />
      </Td>
    </Tr>
  </Tbody>
);

DWPlaceHolderTable.propTypes = {
  columns: PropTypes.number,
};

export const CardLoader = (props) => (
  <Card className="pf-v6-u-m-md">
    <CardBody>
      <Loader {...props} />
    </CardBody>
  </Card>
);

export const DetailLoader = () => (
  <div className="src-c-detail-page">
    <PageHeader>
      <Loader height={96} />
    </PageHeader>
    <Grid>
      <GridItem md="6">
        <CardLoader height={218} />
      </GridItem>
      <GridItem md="6">
        <CardLoader height={218} />
      </GridItem>
      <GridItem md="12">
        <CardLoader height={324} />
      </GridItem>
    </Grid>
  </div>
);
