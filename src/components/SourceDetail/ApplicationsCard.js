import React, { Fragment, useReducer } from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { Card, CardBody, CardTitle, FormGroup, Skeleton, Switch, Tooltip } from '@patternfly/react-core';

import PauseIcon from '@patternfly/react-icons/dist/esm/icons/pause-icon';
import PlayIcon from '@patternfly/react-icons/dist/esm/icons/play-icon';

import { useSource } from '../../hooks/useSource';
import { replaceRouteId, routes } from '../../routes';
import { useHasWritePermissions } from '../../hooks/useHasWritePermissions';
import isSuperKey from '../../utilities/isSuperKey';
import { doCreateApplication, getSourcesApi } from '../../api/entities';
import { addMessage, loadEntities } from '../../redux/sources/actions';
import filterApps from '../../utilities/filterApps';
import ApplicationKebab from './ApplicationKebab';
import { ApplicationLabel } from '../../views/formatters';
import handleError from '../../api/handleError';
import tryAgainMessage from '../../utilities/tryAgainMessage';
import { disabledMessage } from '../../utilities/disabledTooltipProps';
import { COST_MANAGEMENT_APP_ID, HCS_APP_NAME } from '../../utilities/constants';
import { useAppNavigate } from '../../hooks/useAppNavigate';

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

const addResumeNotification = (typeId, dispatch, intl, appTypes) => {
  const appName = appTypes.find((type) => type.id === typeId)?.display_name;

  dispatch(
    addMessage({
      title: intl.formatMessage(
        {
          id: 'detail.applications.resumed.alert.title',
          defaultMessage: '{appName} connection resumed',
        },
        { appName },
      ),
      variant: 'default',
      customIcon: <PlayIcon />,
    }),
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
        { appName },
      ),
      description: intl.formatMessage(
        {
          id: 'detail.applications.paused.alert.description',
          defaultMessage: 'Your application will not reflect the most recent data until {appName} connection is resumed',
        },
        { appName },
      ),
      variant: 'default',
      customIcon: <PauseIcon />,
    }),
  );
};

const addErrorNotification = (dispatch, intl, action, error) => {
  const title = {
    create: intl.formatMessage({
      id: 'detail.applications.add.error',
      defaultMessage: 'Application create failed',
    }),
    pause: intl.formatMessage({
      id: 'detail.applications.pause.error',
      defaultMessage: 'Application pause failed',
    }),
    resume: intl.formatMessage({
      id: 'detail.applications.resume.error',
      defaultMessage: 'Application resume failed',
    }),
  }[action];

  dispatch(
    addMessage({
      title,
      description: tryAgainMessage(intl, handleError(error)),
      variant: 'danger',
    }),
  );
};

const ApplicationsCard = () => {
  const intl = useIntl();
  const source = useSource();
  const navigate = useAppNavigate();
  const sourceTypes = useSelector(({ sources }) => sources.sourceTypes, shallowEqual);
  const appTypes = useSelector(({ sources }) => sources.appTypes, shallowEqual);
  const hcsEnrolled = useSelector(({ sources }) => sources.hcsEnrolled, shallowEqual);
  const hcsEnrolledLoaded = useSelector(({ sources }) => sources.hcsEnrolledLoaded, shallowEqual);
  const isOrgAdmin = useSelector(({ user }) => user.isOrgAdmin);
  const hasRightAccess = useHasWritePermissions();
  const dispatch = useDispatch();
  const [{ selectedApps }, stateDispatch] = useReducer(reducer, initialState);

  const sourceType = sourceTypes.find((type) => type.id === source.source_type_id);
  const sourceTypeName = sourceType?.name;
  const filteredAppTypes = appTypes.filter((type) => type.supported_source_types.includes(sourceTypeName)).filter(filterApps);

  let addApp = async (id, isPaused) => {
    if (!isPaused) {
      navigate(replaceRouteId(routes.sourcesDetailAddApp.path, source.id).replace(':app_type_id', id));
    } else {
      if (typeof selectedApps[id] !== 'boolean') {
        stateDispatch({ type: 'addApp', id });

        try {
          await getSourcesApi().unpauseApplication(isPaused);
          addResumeNotification(id, dispatch, intl, appTypes);
          await dispatch(loadEntities());
        } catch (e) {
          addErrorNotification(dispatch, intl, 'resume', e);
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
        addErrorNotification(dispatch, intl, 'pause', e);
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
            addErrorNotification(dispatch, intl, 'resume', e);
          }
        } else {
          try {
            await doCreateApplication({ source_id: source.id, application_type_id: id });
            await dispatch(loadEntities());
          } catch (e) {
            addErrorNotification(dispatch, intl, 'create', e);
          }
        }

        stateDispatch({ type: 'clean', id });
      }
    };
  }

  return filteredAppTypes.length > 0 ? (
    <Card className="src-c-card-applications pf-v6-u-m-lg pf-v6-u-mr-sm-on-md pf-v6-u-p-lg pf-v6-u-pl-sm-on-md">
      <CardTitle>
        {intl.formatMessage({
          id: 'detail.applications.title',
          defaultMessage: 'Applications',
        })}
      </CardTitle>
      <CardBody>
        <div className="pf-v6-c-form src-c-applications_form">
          {filteredAppTypes.map((app) => {
            const connectedApp = source.applications.find((connectedApp) => connectedApp.application_type_id === app.id);

            const appExist = Boolean(connectedApp);
            const isPaused = Boolean(connectedApp?.paused_at);

            const pausedApp = isPaused ? false : appExist;

            const isChecked = typeof selectedApps[app.id] === 'boolean' ? selectedApps[app.id] : pausedApp;

            const Wrapper = hasRightAccess ? React.Fragment : Tooltip;

            return (
              <FormGroup key={app.id}>
                <div className="src-c-application_flex">
                  {hcsEnrolledLoaded ? (
                    <Fragment>
                      <Wrapper {...(!hasRightAccess && { content: disabledMessage(intl, isOrgAdmin) })}>
                        <Switch
                          className="src-c-application_switch"
                          id={`app-switch-${app.id}`}
                          label={app.id === COST_MANAGEMENT_APP_ID && hcsEnrolled ? HCS_APP_NAME : app.display_name}
                          isChecked={isChecked}
                          isDisabled={connectedApp?.isDeleting || !hasRightAccess || Boolean(source.paused_at)}
                          onChange={(_e, value) =>
                            !value ? removeApp(connectedApp.id, app.id) : addApp(app.id, connectedApp?.id)
                          }
                        />
                      </Wrapper>
                      {Boolean(connectedApp) && (
                        <ApplicationLabel className="pf-v6-u-ml-sm src-m-clickable" app={connectedApp} showStatusText />
                      )}
                      {(isPaused || appExist) && (
                        <ApplicationKebab
                          app={connectedApp}
                          removeApp={() => removeApp(connectedApp.id, app.id)}
                          addApp={() => addApp(app.id, connectedApp.id)}
                        />
                      )}
                    </Fragment>
                  ) : (
                    <Skeleton width="75%" />
                  )}
                </div>
              </FormGroup>
            );
          })}
        </div>
      </CardBody>
    </Card>
  ) : null;
};

export default ApplicationsCard;
