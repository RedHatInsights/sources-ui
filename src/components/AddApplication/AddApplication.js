import React, { useEffect, useReducer, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import isEmpty from 'lodash/isEmpty';
import { useFlag } from '@unleash/proxy-client-react';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

import { loadEntities } from '../../redux/sources/actions';
import SourcesFormRenderer from '../../utilities/SourcesFormRenderer';
import createSchema from './AddApplicationSchema';
import WizardBody from './WizardBody';

import { getSourcesApi } from '../../api/entities';

import { useSource } from '../../hooks/useSource';
import { useIsLoaded } from '../../hooks/useIsLoaded';
import { endpointToUrl } from '../../views/formatters';
import { replaceRouteId, routes } from '../../routes';

import { doAttachApp } from '../../api/doAttachApp';
import { checkSourceStatus } from '../../api/checkSourceStatus';

import reducer, { initialState } from './reducer';
import { Button, Content } from '@patternfly/react-core';

import removeAppSubmit from './removeAppSubmit';
import { diff } from 'deep-object-diff';
import LoadingStep from '../steps/LoadingStep';
import ErroredStep from '../steps/ErroredStep';
import AmazonFinishedStep from '../steps/AmazonFinishedStep';
import FinishedStep from '../steps/FinishedStep';
import TimeoutStep from '../steps/TimeoutStep';
import computeSourceStatus from '../../utilities/computeSourceStatus';
import filterApps from '../../utilities/filterApps';
import computeSourceError from '../../utilities/computeSourceError';
import CloseModal from '../CloseModal';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import AppLink from '../AppLink';
import AppNavigate from '../AppNavigate';

export const onSubmit = (
  values,
  formApi,
  authenticationInitialValues,
  dispatch,
  setState,
  initialValues,
  appTypes,
  setSelectedApp,
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
      }),
    );
};

const FormTemplateWrapper = (props) => <FormTemplate {...props} showFormControls={false} />;

const AddApplication = () => {
  const intl = useIntl();
  const navigate = useAppNavigate();
  const selectedApp = useRef();
  const enableLighthouse = useFlag('sources.wizard.lighthouse');
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
        display_name: appTypes.find(({ id }) => id === state.data?.applications?.[0]?.application_type_id)?.display_name,
      },
      intl,
      undefined,
      dispatch,
      source,
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
              }),
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

  const goToSources = () => navigate(replaceRouteId(routes.sourcesDetail.path, source.id));

  const title = intl.formatMessage(
    {
      id: 'sources.addApplicationNameTitle',
      defaultMessage: 'Connect {appName}',
    },
    {
      appName: applicationType?.display_name || 'application',
    },
  );
  const description = intl.formatMessage(
    {
      id: 'sources.addApplicationNameDescription',
      defaultMessage: 'Configure {appName} for this integration.',
    },
    {
      appName: applicationType?.display_name || 'application',
    },
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

  const sourceType = sourceTypes.find((type) => type.id === source.source_type_id);

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
            <Content
              component="a"
              target="_blank"
              href="https://access.redhat.com/support/cases/#/case/new/open-case?caseCreate=true"
              rel="noopener noreferrer"
            >
              {intl.formatMessage({
                id: 'wizard.openTicket',
                defaultMessage: 'Open a support case',
              })}
            </Content>
          }
        />
      );
    } else {
      switch (computeSourceStatus(state.data)) {
        default:
          if (sourceType.name === 'amazon') {
            shownStep = <AmazonFinishedStep onClose={goToSources} />;
          } else {
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
          }

          break;
        case 'unavailable':
          shownStep = (
            <ErroredStep
              onRetry={onReset}
              onClose={goToSources}
              message={computeSourceError(state.data, intl)}
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
                <AppLink to={replaceRouteId(routes.sourcesDetail.path, source.id)}>
                  <Button variant="primary" className="pf-v6-u-mt-xl">
                    {intl.formatMessage({
                      id: 'wizard.editSource',
                      defaultMessage: 'Edit integration',
                    })}
                  </Button>
                </AppLink>
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
    return <AppNavigate to={'/' + replaceRouteId(routes.sourcesDetail.path, source.id)} />;
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
    appTypes,
    enableLighthouse,
  );

  const hasAvailableApps = filteredAppTypes.length > 0;
  const onSubmitFinal = hasAvailableApps ? onSubmitWrapper : goToSources;

  const onStay = () => {
    container.current.style.opacity = 1;
    container.current.setAttribute('aria-hidden', 'false');

    setState({ type: 'toggleCancelling' });
  };

  const cancelBeforeExit = (values) => {
    const { application: _a, ...initialValues } = state.initialValues;
    const { application: _a1, ...newValues } = values;

    const isChanged = !isEmpty(diff(initialValues, newValues));

    if (isChanged) {
      container.current.style.opacity = 0;
      container.current.setAttribute('aria-hidden', 'true');
      setState({ type: 'toggleCancelling', values });
    } else {
      goToSources();
    }
  };

  return (
    <React.Fragment>
      {state.isCancelling && (
        <CloseModal
          title={intl.formatMessage({
            id: 'sources.manageAppsCloseModalTitle',
            defaultMessage: 'Exit application adding?',
          })}
          onStay={onStay}
          onExit={goToSources}
        />
      )}
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
