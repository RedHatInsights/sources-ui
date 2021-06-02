import React, { useReducer } from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Card, CardBody, CardTitle, Switch, FormGroup } from '@patternfly/react-core';

import PauseIcon from '@patternfly/react-icons/dist/esm/icons/pause-icon';
import PlayIcon from '@patternfly/react-icons/dist/esm/icons/play-icon';

import { useSource } from '../../hooks/useSource';
import { replaceRouteId, routes } from '../../Routes';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import isSuperKey from '../../utilities/isSuperKey';
import { getSourcesApi, doCreateApplication } from '../../api/entities';
import { addMessage, loadEntities } from '../../redux/sources/actions';
import { APP_NAMES } from '../SourceEditForm/parser/application';
import filterApps from '../../utilities/filterApps';
import ApplicationKebab from './ApplicationKebab';
import { ApplicationLabel } from '../../views/formatters';
import handleError from '../../api/handleError';

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
      defaultMessage: 'Includes access to Red Hat gold images, high precision subscription watch data, and autoregistration.',
    }),
  }[name]);

const addResumeNotification = (typeId, dispatch, intl, appTypes) => {
  const appName = appTypes.find((type) => type.id === typeId)?.display_name;

  dispatch(
    addMessage({
      title: intl.formatMessage(
        {
          id: 'detail.applications.resumed.alert.title',
          defaultMessage: '{appName} connection resumed',
        },
        { appName }
      ),
      variant: 'default',
      customIcon: <PlayIcon />,
    })
  );
};

const addPausedNotification = (typeId, dispatch, intl, appTypes) => {
  const appName = appTypes.find((type) => type.id === typeId)?.display_name;

  dispatch(
    addMessage({
      title: intl.formatMessage(
        {
          id: 'detail.applications.paused.alert.title',
          defaultMessage: '{appName} connection paused',
        },
        { appName }
      ),
      description: intl.formatMessage(
        {
          id: 'detail.applications.paused.alert.description',
          defaultMessage: 'Your application will not reflect the most recent data until {appName} connection is resumed',
        },
        { appName }
      ),
      variant: 'default',
      customIcon: <PauseIcon />,
    })
  );
};

const addErrorNotification = (typeId, dispatch, intl, appTypes, action, error) => {
  const appName = appTypes.find((type) => type.id === typeId)?.display_name;

  const title = {
    remove: intl.formatMessage(
      {
        id: 'detail.applications.remove.error',
        defaultMessage: '{appName} removing unsuccessful',
      },
      { appName }
    ),
    create: intl.formatMessage(
      {
        id: 'detail.applications.add.error',
        defaultMessage: '{appName} adding unsuccessful',
      },
      { appName }
    ),
    pause: intl.formatMessage(
      {
        id: 'detail.applications.pause.error',
        defaultMessage: '{appName} pausing unsuccessful',
      },
      { appName }
    ),
    resume: intl.formatMessage(
      {
        id: 'detail.applications.resume.error',
        defaultMessage: '{appName} resuming unsuccessful',
      },
      { appName }
    ),
  }[action];

  dispatch(
    addMessage({
      title,
      description: handleError(error),
      variant: 'danger',
    })
  );
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

  let addApp = async (id, isPaused) => {
    if (!isPaused) {
      push(replaceRouteId(routes.sourcesDetailAddApp.path, source.id).replace(':app_type_id', id));
    } else {
      if (typeof selectedApps[id] !== 'boolean') {
        stateDispatch({ type: 'addApp', id });

        try {
          await getSourcesApi().unpauseApplication(isPaused);
          addResumeNotification(id, dispatch, intl, appTypes);
          await dispatch(loadEntities());
        } catch (e) {
          addErrorNotification(id, dispatch, intl, appTypes, 'resume', e);
        }

        stateDispatch({ type: 'clean', id });
      }
    }
  };

  const removeApp = async (id, typeId) => {
    if (typeof selectedApps[typeId] !== 'boolean') {
      stateDispatch({ type: 'removeApp', id: typeId });
      try {
        await getSourcesApi().pauseApplication(id);
        addPausedNotification(typeId, dispatch, intl, appTypes);
        await dispatch(loadEntities());
      } catch (e) {
        addErrorNotification(typeId, dispatch, intl, appTypes, 'pause', e);
      }

      stateDispatch({ type: 'clean', id: typeId });
    }
  };

  if (isSuperKey(source)) {
    addApp = async (id, isPaused) => {
      if (typeof selectedApps[id] !== 'boolean') {
        stateDispatch({ type: 'addApp', id });

        if (isPaused) {
          try {
            await getSourcesApi().unpauseApplication(isPaused);
            addResumeNotification(id, dispatch, intl, appTypes);
            await dispatch(loadEntities());
          } catch (e) {
            addErrorNotification(id, dispatch, intl, appTypes, 'resume', e);
          }
        } else {
          try {
            await doCreateApplication({ source_id: source.id, application_type_id: id });
            await dispatch(loadEntities());
          } catch (e) {
            addErrorNotification(id, dispatch, intl, appTypes, 'create', e);
          }
        }

        stateDispatch({ type: 'clean', id });
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

            const appExist = Boolean(connectedApp);
            const isPaused = Boolean(connectedApp?.paused_at);

            const pausedApp = isPaused ? false : appExist;

            const isChecked = typeof selectedApps[app.id] === 'boolean' ? selectedApps[app.id] : pausedApp;

            return (
              <FormGroup key={app.id}>
                <div className="ins-c-sources__application_flex">
                  <div>
                    <Switch
                      id={`app-switch-${app.id}`}
                      label={app.display_name}
                      isChecked={isChecked}
                      isDisabled={connectedApp?.isDeleting || !hasRightAccess || Boolean(source.paused_at)}
                      onChange={(value) => (!value ? removeApp(connectedApp.id, app.id) : addApp(app.id, connectedApp?.id))}
                    />
                    {Boolean(connectedApp) && (
                      <ApplicationLabel className="pf-u-ml-sm clickable" app={connectedApp} showStatusText />
                    )}
                    {description && (
                      <div className="pf-c-switch pf-u-mt-sm ins-c-sources__application_fake_switch">
                        <span className="pf-c-switch__toggle ins-c-sources__hide-me" />
                        <div className="pf-c-switch__label ins-c-sources__switch-description">{description}</div>
                      </div>
                    )}
                  </div>
                  {(isPaused || appExist) && (
                    <ApplicationKebab
                      app={connectedApp}
                      removeApp={() => removeApp(connectedApp.id, app.id)}
                      addApp={() => addApp(app.id, connectedApp.id)}
                    />
                  )}
                </div>
              </FormGroup>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};

export default ApplicationsCard;
