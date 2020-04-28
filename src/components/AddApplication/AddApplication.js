import React, { useReducer, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useIntl } from 'react-intl';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import { filterApps, CloseModal } from '@redhat-cloud-services/frontend-components-sources';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';

import { loadEntities } from '../../redux/sources/actions';
import SourcesFormRenderer from '../../utilities/SourcesFormRenderer';
import createSchema from './AddApplicationSchema';
import LoadingStep from './steps/LoadingStep';
import ErroredStep from './steps/ErroredStep';
import FinishedStep from './steps/FinishedStep';
import WizardBody from './WizardBody';

import { getSourcesApi } from '../../api/entities';

import { useSource } from '../../hooks/useSource';
import { useIsLoaded } from '../../hooks/useIsLoaded';
import { endpointToUrl } from '../SourcesTable/formatters';
import { routes } from '../../Routes';

import { doAttachApp } from '../../api/doAttachApp';
import { checkSourceStatus } from '../../api/checkSourceStatus';

import reducer, { initialState } from './reducer';

let selectedApp = undefined; // this has to be not-state value, because it shouldn't re-render the component when changes
const saveSelectedApp = ({ values: { application } }) => selectedApp = application;

export const onSubmit = (values, formApi, authenticationInitialValues, dispatch, setState, initialValues, intl) => {
    setState({ type: 'submit' });

    return doAttachApp(values, formApi, authenticationInitialValues, initialValues, setState, intl)
    .then(async () => {
        checkSourceStatus(initialValues.source.id);
        await dispatch(loadEntities());
        selectedApp = undefined;
        return setState({ type: 'finish' });
    })
    .catch(error => setState({
        type: 'error',
        error,
        values
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
                step={<LoadingStep />}
            />
        );
    }

    if (state.state === 'submitting') {
        return  (
            <WizardBody
                goToSources={goToSources}
                step={<LoadingStep
                    progressStep={state.progressStep}
                    progressTexts={state.progressTexts}
                />}
            />
        );
    }

    const onReset = () => setState({ type: 'reset' });

    if (state.state !== 'wizard') {
        const shownStep = state.state === 'finished' ? (<FinishedStep
            onReset={onReset}
            goToSources={goToSources}
            progressStep={state.progressStep}
            progressTexts={state.progressTexts}
        />) :
            (<ErroredStep
                onReset={onReset}
                goToSources={goToSources}
                error={state.error}
                progressStep={state.progressStep}
                progressTexts={state.progressTexts}
            />);

        return (
            <WizardBody goToSources={goToSources} step={shownStep} />
        );
    }

    const appIds = source.applications.filter(({ isDeleting }) => !isDeleting)
    .reduce((acc, app) => [...acc, app.application_type_id], []);

    const sourceType = sourceTypes.find((type) => type.id === source.source_type_id);
    const sourceTypeName = sourceType && sourceType.name;
    const filteredAppTypes = appTypes.filter((type) =>
        !appIds.includes(type.id) && type.supported_source_types.includes(sourceTypeName)
    ).filter(filterApps);

    const availableAppTypes = filteredAppTypes.map((type) => {
        const hasDeletingApp = source.applications.find(app => app.application_type_id === type.id);
        const label = `${type.display_name} ${hasDeletingApp ? `(${intl.formatMessage({
            id: 'sources.currentlyRemoving',
            defaultMessage: 'Currently removing'
        })})` : ''}`;

        return ({ value: type.id, label, isDisabled: hasDeletingApp ? true : false });
    });

    const schema = createSchema(
        availableAppTypes,
        intl,
        sourceTypes,
        appTypes,
        state.authenticationsValues,
        source,
        state.values,
        container.current
    );

    const onSubmitWrapper = (values, formApi) => onSubmit(
        values,
        formApi,
        state.authenticationsValues,
        dispatch,
        setState,
        state.initialValues,
        intl
    );

    const hasAvailableApps = filteredAppTypes.length > 0;
    const onSubmitFinal = hasAvailableApps ? onSubmitWrapper : goToSources;

    const finalValues = merge(cloneDeep(state.initialValues), state.values);

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
                initialValues={finalValues}
                subscription={{ values: true }}
                onStateUpdate={saveSelectedApp}
                clearedValue={null}
                FormTemplate={FormTemplateWrapper}
            />
        </React.Fragment>
    );
};

export default AddApplication;
