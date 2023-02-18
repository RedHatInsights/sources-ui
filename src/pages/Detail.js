import React, { Suspense, lazy } from 'react';

import { Grid, GridItem } from '@patternfly/react-core';

import SourceSummaryCard from '../components/SourceDetail/SourceSummaryCard';
import ApplicationsCard from '../components/SourceDetail/ApplicationsCard';
import ApplicationResourcesCard from '../components/SourceDetail/ApplicationResourcesCard';
import RedirectNoId from '../components/RedirectNoId/RedirectNoId';
import { useSource } from '../hooks/useSource';
import { DetailLoader } from '../components/SourcesTable/loaders';
import CustomRoute from '../components/CustomRoute/CustomRoute';
import { replaceRouteId, routes } from '../Routing';
import DetailHeader from '../components/SourceDetail/DetailHeader';
import isSuperKey from '../utilities/isSuperKey';
import ResourcesTable from '../components/SourceDetail/ResourcesTable';
import PauseAlert from '../components/SourceDetail/PauseAlert';

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

const EditCredentials = lazy(() =>
  import(
    /* webpackChunkName: "credentialsForm" */
    '../components/CredentialsForm/CredentialsForm'
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
    <div className="src-c-detail-page">
      <Suspense fallback={null}>
        <CustomRoute
          route={{
            ...routes.sourcesDetail,
            path: 'remove',
          }}
          Component={SourceRemoveModal}
          componentProps={{ backPath: replaceRouteId(routes.sourcesDetail.path, source.id) }}
        />
        <CustomRoute route={{ ...routes.sourcesDetailAddApp, path: 'add_app/:app_type_id' }} Component={AddApplication} />
        <CustomRoute route={{ ...routes.sourcesDetailRemoveApp, path: 'remove_app/:app_id' }} Component={RemoveAppModal} />
        <CustomRoute
          route={{
            ...routes.sourcesDetail,
            path: 'rename',
          }}
          Component={SourceRenameModal}
          componentProps={{ backPath: replaceRouteId(routes.sourcesDetail.path, source.id) }}
        />
        <CustomRoute
          route={{
            ...routes.sourcesDetail,
            path: 'edit_credentials',
          }}
          Component={EditCredentials}
          componentProps={{ backPath: replaceRouteId(routes.sourcesDetail.path, source.id) }}
        />
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
