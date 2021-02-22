import React, { useReducer } from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Card } from '@patternfly/react-core/dist/esm/components/Card/Card';
import { CardBody } from '@patternfly/react-core/dist/esm/components/Card/CardBody';
import { CardTitle } from '@patternfly/react-core/dist/esm/components/Card/CardTitle';
import { Switch } from '@patternfly/react-core/dist/esm/components/Switch/Switch';
import { FormGroup } from '@patternfly/react-core/dist/esm/components/Form/FormGroup';

import { useSource } from '../../hooks/useSource';
import { replaceRouteId, routes } from '../../Routes';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import ApplicationStatusLabel from './ApplicationStatusLabel';
import isSuperKey from '../../utilities/isSuperKey';
import { getSourcesApi, doCreateApplication } from '../../api/entities';
import { loadEntities } from '../../redux/sources/actions';
import { APP_NAMES } from '../SourceEditForm/parser/application';
import filterApps from '../../addSourceWizard/utilities/filterApps';

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

const descriptionMapper = (name, intl) =>
  ({
    [APP_NAMES.COST_MANAGAMENT]: intl.formatMessage({
      id: 'cost.app.description',
      defaultMessage: 'Analyze, forecast, and optimize your Red Hat OpenShift cluster costs in hybrid cloud environments.',
    }),
    [APP_NAMES.CLOUD_METER]: intl.formatMessage({
      id: 'cost.app.description',
      defaultMessage:
        'Includes access to Red Hat Gold Images, high precision subscription watch data, autoregistration, and Red Hat Connector.',
    }),
  }[name]);

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
      if (typeof selectedApps[typeId] !== 'boolean') {
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
            const description = descriptionMapper(app.name, intl);

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
                {description && (
                  <div className="pf-c-switch pf-u-mt-sm">
                    <span className="pf-c-switch__toggle ins-c-sources__hide-me" />
                    <div className="pf-c-switch__label ins-c-sources__switch-description">{description}</div>
                  </div>
                )}
              </FormGroup>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

export default ApplicationsCard;
