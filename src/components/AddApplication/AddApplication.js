import React, { useReducer, useEffect, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useIntl } from 'react-intl';

import filterApps from '@redhat-cloud-services/frontend-components-sources/cjs/filterApps';
import CloseModal from '@redhat-cloud-services/frontend-components-sources/cjs/CloseModal';
import LoadingStep from '@redhat-cloud-services/frontend-components-sources/cjs/LoadingStep';
import ErroredStep from '@redhat-cloud-services/frontend-components-sources/cjs/ErroredStep';
import FinishedStep from '@redhat-cloud-services/frontend-components-sources/cjs/FinishedStep';
import TimeoutStep from '@redhat-cloud-services/frontend-components-sources/cjs/TimeoutStep';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';

import { loadEntities } from '../../redux/sources/actions';
import SourcesFormRenderer from '../../utilities/SourcesFormRenderer';
import createSchema from './AddApplicationSchema';
import WizardBody from './WizardBody';

import { getSourcesApi } from '../../api/entities';

import { useSource } from '../../hooks/useSource';
import { useIsLoaded } from '../../hooks/useIsLoaded';
import { endpointToUrl } from '../SourcesTable/formatters';
import { routes, replaceRouteId } from '../../Routes';

import { doAttachApp } from '../../api/doAttachApp';
import { checkSourceStatus } from '../../api/checkSourceStatus';

import reducer, { initialState } from './reducer';
import { Button } from '@patternfly/react-core/dist/js/components/Button';
import { Text } from '@patternfly/react-core/dist/js/components/Text';

import removeAppSubmit from './removeAppSubmit';

let selectedApp = undefined; // this has to be not-state value, because it shouldn't re-render the component when changes
const saveSelectedApp = ({ values: { application } }) => selectedApp = application;

export const onSubmit = (values, formApi, authenticationInitialValues, dispatch, setState, initialValues, appTypes) => {
    setState({ type: 'submit', values, formApi });

    return doAttachApp(values, formApi, authenticationInitialValues, initialValues, appTypes)
    .then(async (data) => {
        checkSourceStatus(initialValues.source.id);
        await dispatch(loadEntities());
        selectedApp = undefined;
        return setState({ type: 'finish', data });
    })
    .catch(error => setState({
        type: 'error',
        error,
    }));
};

const FormTemplateWrapper = (props) => <FormTemplate {...props} showFormControls={false} />;

const AddApplication = () => {
    const intl = useIntl();
    const history = useHistory();

    const loaded = useIsLoaded();

    const {
        appTypes,
        sourceTypesLoaded,
        appTypesLoaded,
        sourceTypes,
    } = useSelector(({ sources }) => sources, shallowEqual);

    const source = useSource();

    const dispatch = useDispatch();

    const [state, setState] = useReducer(reducer, initialState);

    const container = useRef(document.createElement('div'));

    const removeApp = () => {
        setState({ type: 'reset' });

        return removeAppSubmit(
            { id: state.data?.id, display_name: appTypes.find(({ id }) => id === state.data?.application_type_id)?.display_name },
            intl,
            undefined,
            dispatch,
            source
        );
    };

    useEffect(() => {
        selectedApp = undefined;
    }, []);

    useEffect(() => {
        if (source) {
            // When app is only removed, there is no need to reload values
            const removeAppAction = state.sourceAppsLength >= source.applications.length && state.sourceAppsLength > 0;

            setState({ type: 'setSourceAppslength', length: source.applications.length });

            if (!removeAppAction) {
                if (source.endpoints && source.endpoints[0]) {
                    getSourcesApi()
                    .listEndpointAuthentications(source.endpoints[0].id)
                    .then(({ data }) => setState({
                        type: 'loadAuthentications',
                        authenticationsValues: data,
                        initialValues: {
                            source,
                            endpoint: source.endpoints[0],
                            url: endpointToUrl(source.endpoints[0]),
                            application: selectedApp,
                        },
                        values: {}
                    }));
                } else {
                    setState({
                        type: 'loadWithoutAuthentications',
                        initialValues: { source, application: selectedApp },
                        values: {}
                    });
                }
            }
        }
    }, [source]);

    const goToSources = () => history.push(routes.sources.path);

    if ((!appTypesLoaded || !sourceTypesLoaded || !loaded || state.state === 'loading') && state.state !== 'submitting') {
        return  (
            <WizardBody
                goToSources={goToSources}
                step={<LoadingStep
                    customText={intl.formatMessage({
                        id: 'sources.loading',
                        defaultMessage: 'Loading, please wait.'
                    })}
                    cancelTitle={intl.formatMessage({
                        id: 'sources.close',
                        defaultMessage: 'Close'
                    })}
                    onClose={goToSources}
                />}
            />
        );
    }

    const onSubmitWrapper = (values, formApi) => onSubmit(
        values,
        formApi,
        state.authenticationsValues,
        dispatch,
        setState,
        state.initialValues,
        appTypes
    );

    if (state.state === 'submitting') {
        return  (
            <WizardBody
                name={source.name}
                goToSources={goToSources}
                step={<LoadingStep
                    cancelTitle={intl.formatMessage({
                        id: 'sources.close',
                        defaultMessage: 'Close'
                    })}
                    onClose={goToSources}
                    customText={intl.formatMessage({
                        id: 'wizard.loadingText defaultMessage=Validating source credentials',
                        defaultMessage: 'Validating source credentials'
                    })}
                />}
            />
        );
    }

    const onReset = () => setState({ type: 'reset' });

    if (state.state !== 'wizard') {
        let shownStep;

        if (state.state !== 'finished') {
            shownStep = (<ErroredStep
                onRetry={onReset}
                onClose={goToSources}
                returnButtonTitle={intl.formatMessage({
                    id: 'sources.retry',
                    defaultMessage: 'Retry'
                })}
                primaryAction={() => onSubmitWrapper(state.values, state.formApi)}
                secondaryActions={
                    <Text
                        component='a'
                        target="_blank"
                        href="https://access.redhat.com/support/cases/#/case/new/open-case?caseCreate=true"
                        rel="noopener noreferrer"
                    >
                        {intl.formatMessage({ id: 'wizard.openTicket', defaultMessage: 'Open a support case' })}
                    </Text>
                }
            />);
        } else {
            switch (state.data.availability_status) {
                case 'available':
                    shownStep = (<FinishedStep
                        title={intl.formatMessage({
                            id: 'sources.configurationSuccessful',
                            defaultMessage: 'Configuration successful'
                        })}
                        hideSourcesButton={true}
                        onReset={onReset}
                        onClose={goToSources}
                        secondaryActions={
                            <Button variant="link" onClick={onReset}>
                                { intl.formatMessage({
                                    id: 'sources.continueManageApp',
                                    defaultMessage: 'Continue managing applications'
                                }) }
                            </Button>
                        }
                        returnButtonTitle={
                            intl.formatMessage({
                                id: 'sources.backToSources',
                                defaultMessage: 'Back to Sources'
                            })
                        }
                        successfulMessage={
                            intl.formatMessage({
                                id: 'sources.successAddApp',
                                defaultMessage: 'Your application was successfully added.'
                            })
                        }
                    />);
                    break;
                case 'unavailable':
                    shownStep = (<ErroredStep
                        onRetry={onReset}
                        onClose={goToSources}
                        message={
                            state.data.availability_status_error
                            || intl.formatMessage({ id: 'wizard.unknownError', defaultMessage: 'Unknown error' })
                        }
                        title={intl.formatMessage({
                            id: 'sources.configurationSuccessful',
                            defaultMessage: 'Configuration unsuccessful'
                        })}
                        secondaryActions={<Button variant="link" onClick={ removeApp }>
                            {intl.formatMessage({ id: 'wizard.removeApp', defaultMessage: 'Remove application' })}
                        </Button>}
                        Component={() => (
                            <Link to={replaceRouteId(routes.sourcesEdit.path, source.id)}>
                                <Button variant='primary' className="pf-u-mt-xl">
                                    { intl.formatMessage({ id: 'wizard.editSource', defaultMessage: 'Edit source' })}
                                </Button>
                            </Link>
                        )}
                    />);
                    break;
                default:
                    shownStep = (<TimeoutStep
                        returnButtonTitle={
                            intl.formatMessage({
                                id: 'sources.backToSources',
                                defaultMessage: 'Back to Sources'
                            })
                        }
                        onClose={ goToSources }
                        secondaryActions={<Button variant="link" onClick={onReset}>
                            { intl.formatMessage({
                                id: 'sources.continueManageApp',
                                defaultMessage: 'Continue managing applications'
                            }) }
                        </Button>}
                    />);
            }
        }

        return (
            <WizardBody name={source.name} goToSources={goToSources} step={shownStep} />
        );
    }

    const sourceType = sourceTypes.find((type) => type.id === source.source_type_id);
    const sourceTypeName = sourceType && sourceType.name;
    const filteredAppTypes = appTypes.filter((type) =>
        type.supported_source_types.includes(sourceTypeName)
    )
    .filter(filterApps)
    .map((type) => ({
        value: type.id,
        label: type.display_name
    }));

    const schema = createSchema(
        filteredAppTypes,
        intl,
        sourceTypes,
        appTypes,
        state.authenticationsValues,
        source,
        container.current
    );

    const hasAvailableApps = filteredAppTypes.length > 0;
    const onSubmitFinal = hasAvailableApps ? onSubmitWrapper : goToSources;

    const onStay = () => {
        container.current.hidden = false;
        setState({ type: 'toggleCancelling' });
    };

    const cancelBeforeExit = (values) => {
        if (values?.application) {
            container.current.hidden = true;
            setState({ type: 'toggleCancelling', values }); }
        else {
            goToSources();
        }
    };

    return (
        <React.Fragment>
            <CloseModal
                title={
                    intl.formatMessage({
                        id: 'sources.manageAppsCloseModalTitle', defaultMessage: 'Exit application adding?'
                    })
                }
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
