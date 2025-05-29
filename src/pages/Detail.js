import React, { Suspense } from 'react';

import { Grid, GridItem } from '@patternfly/react-core';

import SourceSummaryCard from '../components/SourceDetail/SourceSummaryCard';
import ApplicationsCard from '../components/SourceDetail/ApplicationsCard';
import ApplicationResourcesCard from '../components/SourceDetail/ApplicationResourcesCard';
import RedirectNoId from '../components/RedirectNoId/RedirectNoId';
import { useSource } from '../hooks/useSource';
import { DetailLoader } from '../components/SourcesTable/loaders';
import { replaceRouteId, routes } from '../routes';
import DetailHeader from '../components/SourceDetail/DetailHeader';
import isSuperKey from '../utilities/isSuperKey';
import ResourcesTable from '../components/SourceDetail/ResourcesTable';
import PauseAlert from '../components/SourceDetail/PauseAlert';
import { Outlet } from 'react-router-dom';

const Detail = () => {
  const source = useSource();
  if (!source) {
    return (
      <React.Fragment>
        <DetailLoader />
        <RedirectNoId />
      </React.Fragment>
    );
  }

  const superKey = isSuperKey(source);

  return (
    <div className="src-c-detail-page">
      <Suspense fallback={null}>
        <Outlet context={{ backPath: replaceRouteId(routes.sourcesDetail.path, source.id) }} />
      </Suspense>
      <DetailHeader />
      {source.paused_at && <PauseAlert />}
      <Grid>
        <GridItem md="6">
          <SourceSummaryCard />
        </GridItem>
        <GridItem md="6">
          <ApplicationsCard />
        </GridItem>
        <GridItem md="12">{superKey ? <ResourcesTable /> : <ApplicationResourcesCard />}</GridItem>
      </Grid>
    </div>
  );
};

export default Detail;
