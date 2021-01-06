import React, { useReducer, useEffect, useRef } from 'react';
import { useHistory, Link, useParams, Redirect } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useIntl } from 'react-intl';
import isEmpty from 'lodash/isEmpty';

import filterApps from '@redhat-cloud-services/frontend-components-sources/cjs/filterApps';
import CloseModal from '@redhat-cloud-services/frontend-components-sources/cjs/CloseModal';
import LoadingStep from '@redhat-cloud-services/frontend-components-sources/cjs/LoadingStep';
import ErroredStep from '@redhat-cloud-services/frontend-components-sources/cjs/ErroredStep';
import FinishedStep from '@redhat-cloud-services/frontend-components-sources/cjs/FinishedStep';
import TimeoutStep from '@redhat-cloud-services/frontend-components-sources/cjs/TimeoutStep';
import computeSourceStatus from '@redhat-cloud-services/frontend-components-sources/cjs/computeSourceStatus';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';

import { loadEntities } from '../../redux/sources/actions';
import SourcesFormRenderer from '../../utilities/SourcesFormRenderer';
import createSchema from './AddApplicationSchema';
import WizardBody from './WizardBody';

import { getSourcesApi } from '../../api/entities';

import { useSource } from '../../hooks/useSource';
import { useIsLoaded } from '../../hooks/useIsLoaded';
import { endpointToUrl } from '../../views/formatters';
import { routes, replaceRouteId } from '../../Routes';

import { doAttachApp } from '../../api/doAttachApp';
import { checkSourceStatus } from '../../api/checkSourceStatus';

import reducer, { initialState } from './reducer';
import { Button } from '@patternfly/react-core/dist/js/components/Button';
import { Text } from '@patternfly/react-core/dist/js/components/Text';

import removeAppSubmit from './removeAppSubmit';
import { diff } from 'deep-object-diff';

export const onSubmit = (
  values,
  formApi,
  authenticationInitialValues,
  dispatch,
  setState,
  initialValues,
  appTypes,
  setSelectedApp
) => {
  setState({ type: 'submit', values, formApi });

  return doAttachApp(values, formApi, authenticationInitialValues, initialValues, appTypes)
    .then(async (data) => {
      checkSourceStatus(initialValues.source.id);
      await dispatch(loadEntities());
      setSelectedApp({ values: { application: null } });
      return setState({ type: 'finish', data });
    })
    .catch((error) =>
      setState({
        type: 'error',
        error,
      })
    );
};

const FormTemplateWrapper = (props) => <FormTemplate {...props} showFormControls={false} />;

const AddApplication = () => {
  const intl = useIntl();
  const history = useHistory();
  const selectedApp = useRef();
  const saveSelectedApp = ({ values: { application } }) => (selectedApp.current = application);
  const { app_type_id } = useParams();

  const loaded = useIsLoaded();

  const { appTypes, sourceTypesLoaded, appTypesLoaded, sourceTypes } = useSelector(({ sources }) => sources, shallowEqual);

  const source = useSource();

  const dispatch = useDispatch();

  const [state, setState] = useReducer(reducer, initialState);

  const container = useRef(document.createElement('div'));

  const applicationType = appTypes.find(({ id }) => id === app_type_id);

  const removeApp = () => {
    setState({ type: 'reset' });

    return removeAppSubmit(
      {
        id: state.data?.id,
        display_name: appTypes.find(({ id }) => id === state.data?.application_type_id)?.display_name,
      },
      intl,
      undefined,
      dispatch,
      source
    );
  };

  useEffect(() => {
    if (source) {
      // When app is only removed, there is no need to reload values
      const removeAppAction = state.sourceAppsLength >= source.applications.length && state.sourceAppsLength > 0;

      setState({
        type: 'setSourceAppslength',
        length: source.applications.length,
      });

      if (!removeAppAction) {
        if (source.endpoints && source.endpoints[0]) {
          getSourcesApi()
            .listEndpointAuthentications(source.endpoints[0].id)
            .then(({ data }) =>
              setState({
                type: 'loadAuthentications',
                authenticationsValues: data,
                initialValues: {
                  source,
                  endpoint: source.endpoints[0],
                  url: endpointToUrl(source.endpoints[0]),
                  application: selectedApp.current,
                },
                values: {},
              })
            );
        } else {
          setState({
            type: 'loadWithoutAuthentications',
            initialValues: { source, application: selectedApp.current },
            values: {},
          });
        }
      }
    }
  }, [source]);

  const goToSources = () => history.push(replaceRouteId(routes.sourcesDetail.path, source.id));

  const title = intl.formatMessage(
    {
      id: 'sources.addApplicationNameTitle',
      defaultMessage: 'Connect {appName}',
    },
    {
      appName: applicationType?.display_name || 'application',
    }
  );
  const description = intl.formatMessage(
    {
      id: 'sources.addApplicationNameDescription',
      defaultMessage: 'Configure {appName} for this source.',
    },
    {
      appName: applicationType?.display_name || 'application',
    }
  );

  if ((!appTypesLoaded || !sourceTypesLoaded || !loaded || state.state === 'loading') && state.state !== 'submitting') {
    return (
      <WizardBody
        goToSources={goToSources}
        title={title}
        description={description}
        step={
          <LoadingStep
            customText={intl.formatMessage({
              id: 'sources.loading',
              defaultMessage: 'Loading, please wait.',
            })}
            cancelTitle={intl.formatMessage({
              id: 'sources.close',
              defaultMessage: 'Close',
            })}
            onClose={goToSources}
          />
        }
      />
    );
  }

  const onSubmitWrapper = (values, formApi) =>
    onSubmit(values, formApi, state.authenticationsValues, dispatch, setState, state.initialValues, appTypes, saveSelectedApp);

  if (state.state === 'submitting') {
    return (
      <WizardBody
        title={title}
        description={description}
        goToSources={goToSources}
        step={
          <LoadingStep
            cancelTitle={intl.formatMessage({
              id: 'sources.close',
              defaultMessage: 'Close',
            })}
            onClose={goToSources}
            customText={intl.formatMessage({
              id: 'wizard.loadingText',
              defaultMessage: 'Validating credentials',
            })}
            description={intl.formatMessage({
              id: 'wizard.loadingDescription',
              defaultMessage:
                'This could take a minute. If you prefer not to wait, close this dialog and the process will continue.',
            })}
          />
        }
      />
    );
  }

  const onReset = () => setState({ type: 'reset' });

  if (state.state !== 'wizard') {
    let shownStep;

    if (state.state !== 'finished') {
      shownStep = (
        <ErroredStep
          onRetry={onReset}
          onClose={goToSources}
          returnButtonTitle={intl.formatMessage({
            id: 'sources.retry',
            defaultMessage: 'Retry',
          })}
          primaryAction={() => onSubmitWrapper(state.values, state.formApi)}
          secondaryActions={
            <Text
              component="a"
              target="_blank"
              href="https://access.redhat.com/support/cases/#/case/new/open-case?caseCreate=true"
              rel="noopener noreferrer"
            >
              {intl.formatMessage({
                id: 'wizard.openTicket',
                defaultMessage: 'Open a support case',
              })}
            </Text>
          }
        />
      );
    } else {
      switch (computeSourceStatus(state.data)) {
        default:
          shownStep = (
            <FinishedStep
              title={intl.formatMessage({
                id: 'sources.configurationSuccessful',
                defaultMessage: 'Configuration successful',
              })}
              hideSourcesButton={true}
              onClose={goToSources}
              returnButtonTitle={intl.formatMessage({
                id: 'sources.exit',
                defaultMessage: 'Exit',
              })}
              successfulMessage={intl.formatMessage({
                id: 'sources.successAddApp',
                defaultMessage: 'Your application was successfully added.',
              })}
            />
          );
          break;
        case 'unavailable':
          shownStep = (
            <ErroredStep
              onRetry={onReset}
              onClose={goToSources}
              message={
                state.data.applications?.[0]?.availability_status_error ||
                state.data.endpoint?.[0]?.availability_status_error ||
                intl.formatMessage({
                  id: 'wizard.unknownError',
                  defaultMessage: 'Unknown error',
                })
              }
              title={intl.formatMessage({
                id: 'sources.configurationSuccessful',
                defaultMessage: 'Configuration unsuccessful',
              })}
              secondaryActions={
                <Button variant="link" onClick={removeApp}>
                  {intl.formatMessage({
                    id: 'wizard.removeApp',
                    defaultMessage: 'Remove application',
                  })}
                </Button>
              }
              Component={() => (
                <Link to={replaceRouteId(routes.sourcesDetail.path, source.id)}>
                  <Button variant="primary" className="pf-u-mt-xl">
                    {intl.formatMessage({
                      id: 'wizard.editSource',
                      defaultMessage: 'Edit source',
                    })}
                  </Button>
                </Link>
              )}
            />
          );
          break;
        case 'timeout':
          shownStep = (
            <TimeoutStep
              returnButtonTitle={intl.formatMessage({
                id: 'sources.exit',
                defaultMessage: 'Exit',
              })}
              onClose={goToSources}
            />
          );
          break;
      }
    }

    return <WizardBody title={title} description={description} goToSources={goToSources} step={shownStep} />;
  }

  const sourceType = sourceTypes.find((type) => type.id === source.source_type_id);
  const sourceTypeName = sourceType && sourceType.name;
  const filteredAppTypes = appTypes
    .filter((type) => type.supported_source_types.includes(sourceTypeName))
    .filter(filterApps)
    .map((type) => ({
      value: type.id,
      label: type.display_name,
    }));

  if (
    !applicationType ||
    source.applications.find(({ application_type_id }) => application_type_id === app_type_id) ||
    !applicationType.supported_source_types.includes(sourceType.name)
  ) {
    return <Redirect to={replaceRouteId(routes.sourcesDetail.path, source.id)} />;
  }

  const schema = createSchema(
    intl,
    sourceType,
    applicationType,
    state.authenticationsValues,
    source,
    container.current,
    title,
    description,
    appTypes
  );

  const hasAvailableApps = filteredAppTypes.length > 0;
  const onSubmitFinal = hasAvailableApps ? onSubmitWrapper : goToSources;

  const onStay = () => {
    container.current.hidden = false;
    setState({ type: 'toggleCancelling' });
  };

  const cancelBeforeExit = (values) => {
    // eslint-disable-next-line no-unused-vars
    const { application: _a, ...initialValues } = state.initialValues;
    // eslint-disable-next-line no-unused-vars
    const { application: _a1, ...newValues } = values;

    const isChanged = !isEmpty(diff(initialValues, newValues));

    if (isChanged) {
      container.current.hidden = true;
      setState({ type: 'toggleCancelling', values });
    } else {
      goToSources();
    }
  };

  return (
    <React.Fragment>
      <CloseModal
        title={intl.formatMessage({
          id: 'sources.manageAppsCloseModalTitle',
          defaultMessage: 'Exit application adding?',
        })}
        isOpen={state.isCancelling}
        onStay={onStay}
        onExit={goToSources}
      />
      <SourcesFormRenderer
        schema={schema}
        showFormControls={false}
        onSubmit={onSubmitFinal}
        onCancel={cancelBeforeExit}
        initialValues={state.initialValues}
        subscription={{ values: true }}
        debug={saveSelectedApp}
        clearedValue={null}
        FormTemplate={FormTemplateWrapper}
      />
    </React.Fragment>
  );
};

export default AddApplication;
