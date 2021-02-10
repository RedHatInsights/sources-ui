import React, { useReducer } from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Card } from '@patternfly/react-core/dist/esm/components/Card/Card';
import { CardBody } from '@patternfly/react-core/dist/esm/components/Card/CardBody';
import { CardTitle } from '@patternfly/react-core/dist/esm/components/Card/CardTitle';
import { Switch } from '@patternfly/react-core/dist/esm/components/Switch/Switch';
import { FormGroup } from '@patternfly/react-core/dist/esm/components/Form/FormGroup';

import filterApps from '@redhat-cloud-services/frontend-components-sources/esm/filterApps';

import { useSource } from '../../hooks/useSource';
import { replaceRouteId, routes } from '../../Routes';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import ApplicationStatusLabel from './ApplicationStatusLabel';
import isSuperKey from '../../utilities/isSuperKey';
import { getSourcesApi, doCreateApplication } from '../../api/entities';
import { loadEntities } from '../../redux/sources/actions';

const initialState = {
  selectedApps: {},
};

const reducer = (state, { type, id }) => {
  switch (type) {
    case 'addApp':
      return { ...state, selectedApps: { ...state.selectedApps, [id]: true } };
    case 'removeApp':
      return { ...state, selectedApps: { ...state.selectedApps, [id]: false } };
    case 'clean':
      return { ...state, selectedApps: { ...state.selectedApps, [id]: undefined } };
  }
};

const ApplicationsCard = () => {
  const intl = useIntl();
  const source = useSource();
  const { push } = useHistory();
  const sourceTypes = useSelector(({ sources }) => sources.sourceTypes, shallowEqual);
  const appTypes = useSelector(({ sources }) => sources.appTypes, shallowEqual);
  const hasRightAccess = useHasWritePermissions();
  const dispatch = useDispatch();
  const [{ selectedApps }, stateDispatch] = useReducer(reducer, initialState);

  const sourceType = sourceTypes.find((type) => type.id === source.source_type_id);
  const sourceTypeName = sourceType?.name;
  const filteredAppTypes = appTypes.filter((type) => type.supported_source_types.includes(sourceTypeName)).filter(filterApps);

  let removeApp = (id) => push(replaceRouteId(routes.sourcesDetailRemoveApp.path, source.id).replace(':app_id', id));
  let addApp = (id) => push(replaceRouteId(routes.sourcesDetailAddApp.path, source.id).replace(':app_type_id', id));

  if (isSuperKey(source)) {
    removeApp = async (id, typeId) => {
      if (typeof selectedApps[id] !== 'boolean') {
        stateDispatch({ type: 'removeApp', id: typeId });
        await getSourcesApi().deleteApplication(id);
        stateDispatch({ type: 'clean', id: typeId });
        await dispatch(loadEntities());
      }
    };

    addApp = async (id) => {
      if (typeof selectedApps[id] !== 'boolean') {
        stateDispatch({ type: 'addApp', id });
        await doCreateApplication({ source_id: source.id, application_type_id: id });
        stateDispatch({ type: 'clean', id });
        await dispatch(loadEntities());
      }
    };
  }

  return (
    <Card className="card applications-card pf-u-p-lg pf-u-pl-sm-on-md">
      <CardTitle>
        {intl.formatMessage({
          id: 'detail.applications.title',
          defaultMessage: 'Applications',
        })}
      </CardTitle>
      <CardBody>
        {!hasRightAccess && (
          <div className="pf-u-mb-md" id="no-permissions-applications">
            {intl.formatMessage({
              id: 'sources.notAdminButton',
              defaultMessage:
                'To perform this adding/removing applications, you must be granted write permissions from your Organization Administrator.',
            })}
          </div>
        )}
        <div className="pf-c-form">
          {filteredAppTypes.map((app) => {
            const connectedApp = source.applications.find((connectedApp) => connectedApp.application_type_id === app.id);

            return (
              <FormGroup key={app.id}>
                <Switch
                  id={`app-switch-${app.id}`}
                  label={app.display_name}
                  isChecked={typeof selectedApps[app.id] === 'boolean' ? selectedApps[app.id] : Boolean(connectedApp)}
                  isDisabled={connectedApp?.isDeleting || !hasRightAccess}
                  onChange={(value) => (!value ? removeApp(connectedApp.id, app.id) : addApp(app.id))}
                />
                {Boolean(connectedApp) && <ApplicationStatusLabel app={connectedApp} />}
              </FormGroup>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

export default ApplicationsCard;
