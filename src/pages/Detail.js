import React, { lazy, Suspense } from 'react';

import { Grid } from '@patternfly/react-core/dist/esm/layouts/Grid/Grid';
import { GridItem } from '@patternfly/react-core/dist/esm/layouts/Grid/GridItem';

import SourceSummaryCard from '../components/SourceDetail/SourceSummaryCard';
import ApplicationsCard from '../components/SourceDetail/ApplicationsCard';
import ApplicationResourcesCard from '../components/SourceDetail/ApplicationResourcesCard';
import RedirectNoId from '../components/RedirectNoId/RedirectNoId';
import { useSource } from '../hooks/useSource';
import { DetailLoader } from '../components/SourcesTable/loaders';
import CustomRoute from '../components/CustomRoute/CustomRoute';
import { replaceRouteId, routes } from '../Routes';
import DetailHeader from '../components/SourceDetail/DetailHeader';
import isSuperKey from '../utilities/isSuperKey';
import ResourcesTable from '../components/SourceDetail/ResourcesTable';

const SourceRemoveModal = lazy(() =>
  import(
    /* webpackChunkName: "removeSource" */
    '../components/SourceRemoveModal/SourceRemoveModal'
  )
);

const AddApplication = lazy(() =>
  import(
    /* webpackChunkName: "addApplication" */
    '../components/AddApplication/AddApplication'
  )
);

const RemoveAppModal = lazy(() =>
  import(
    /* webpackChunkName: "removeApplication" */
    '../components/AddApplication/RemoveAppModal'
  )
);

const SourceRenameModal = lazy(() =>
  import(
    /* webpackChunkName: "renameSource" */
    '../components/SourceDetail/SourceRenameModal'
  )
);

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
    <div className="ins-c-sources__detail-page">
      <Suspense fallback={null}>
        <CustomRoute
          exact
          route={routes.sourcesDetailRemove}
          Component={SourceRemoveModal}
          componentProps={{ backPath: replaceRouteId(routes.sourcesDetail.path, source.id) }}
        />
        <CustomRoute exact route={routes.sourcesDetailAddApp} Component={AddApplication} />
        <CustomRoute exact route={routes.sourcesDetailRemoveApp} Component={RemoveAppModal} />
        <CustomRoute exact route={routes.sourcesDetailRename} Component={SourceRenameModal} />
      </Suspense>
      <DetailHeader />
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
