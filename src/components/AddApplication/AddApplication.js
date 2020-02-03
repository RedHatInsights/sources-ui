import React, { useReducer, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useIntl } from 'react-intl';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';

import { loadEntities } from '../../redux/sources/actions';
import SourcesFormRenderer from '../../Utilities/SourcesFormRenderer';
import createSchema from './AddApplicationSchema';
import LoadingStep from '../steps/LoadingStep';
import ErroredStep from './steps/ErroredStep';
import FinishedStep from './steps/FinishedStep';
import WizardBody from './WizardBody';

import { getSourcesApi } from '../../api/entities';

import { useSource } from '../../hooks/useSource';
import { useIsLoaded } from '../../hooks/useIsLoaded';
import { endpointToUrl } from '../SourcesSimpleView/formatters';
import { routes } from '../../Routes';

import { doAttachApp } from '../../api/doAttachApp';
import { onCanelAddApplication } from './onCancel';

let selectedApp = undefined; // this has to be not-state value, because it shouldn't re-render the component when changes
const saveSelectedApp = ({ values: { application } }) => selectedApp = application;

export const onSubmit = (values, formApi, authenticationInitialValues, dispatch, setState, initialValues) => {
    setState({ state: 'submitting' });

    return doAttachApp(values, formApi, authenticationInitialValues, initialValues)
    .then(async () => {
        await dispatch(loadEntities());
        selectedApp = undefined;
        return setState({ state: 'finished' });
    })
    .catch(error => setState({
        state: 'errored',
        error,
        values
    }));
};

const initialState = {
    state: 'loading',
    error: '',
    values: {},
    authenticationsValues: [],
    sourceAppsLength: 0,
    initialValues: {}
};

const reducer = (state, payload) => ({ ...state, ...payload });

const AddApplication = () => {
    const intl = useIntl();
    const history = useHistory();

    const loaded = useIsLoaded();

    const {
        appTypes,
        sourceTypesLoaded,
        appTypesLoaded,
        sourceTypes,
        addSourceInitialValues
    } = useSelector(({ sources }) => sources, shallowEqual);

    const source = useSource();

    const dispatch = useDispatch();

    const [state, setState] = useReducer(reducer, initialState);

    useEffect(() => {
        selectedApp = undefined;
    }, []);

    useEffect(() => {
        if (source) {
            // When app is only removed, there is no need to reload values
            const removeAppAction = state.sourceAppsLength >= source.applications.length && state.sourceAppsLength > 0;

            setState({ sourceAppsLength: source.applications.length });

            if (!removeAppAction) {
                if (source.endpoints && source.endpoints[0]) {
                    getSourcesApi()
                    .listEndpointAuthentications(source.endpoints[0].id)
                    .then(({ data }) => setState({
                        authenticationsValues: data,
                        initialValues: {
                            source,
                            endpoint: source.endpoints[0],
                            url: endpointToUrl(source.endpoints[0]),
                            application: selectedApp,
                            values: {}
                        }
                    }))
                    .then(() => {
                        if (state.state === 'loading') {
                            setState({
                                state: 'wizard'
                            });
                        }
                    });
                } else {
                    setState({
                        initialValues: { source, application: selectedApp },
                        values: {}
                    });
                    if (state.state === 'loading') {
                        setState({
                            state: 'wizard'
                        });
                    }
                }
            }
        }
    }, [source]);

    const goToSources = () => history.push(routes.sources.path);

    if (!appTypesLoaded || !sourceTypesLoaded || !loaded) {
        return  (
            <WizardBody
                goToSources={goToSources}
                step={<LoadingStep />}
            />
        );
    }

    if (state.state === 'loading' || state.state === 'submitting') {
        return  (
            <WizardBody
                goToSources={goToSources}
                step={<LoadingStep />}
            />
        );
    }

    if (state.state !== 'wizard') {
        const shownStep = state.state === 'finished' ? (<FinishedStep setState={setState} goToSources={goToSources}/>) :
            (<ErroredStep setState={setState} goToSources={goToSources} error={state.error}/>);

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
    );

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
        source
    );

    const onSubmitWrapper = (values, formApi) => onSubmit(
        values,
        formApi,
        state.authenticationsValues,
        dispatch,
        setState,
        state.initialValues
    );

    const hasAvailableApps = filteredAppTypes.length > 0;
    const onSubmitFinal = hasAvailableApps ? onSubmitWrapper : goToSources;

    const onCancel = (values) => onCanelAddApplication({ values, dispatch, intl, sourceId: source.id, history });

    const finalValues = merge(cloneDeep(state.initialValues), merge(cloneDeep(addSourceInitialValues), state.values));

    return (
        <SourcesFormRenderer
            schema={schema}
            showFormControls={false}
            onSubmit={onSubmitFinal}
            onCancel={onCancel}
            initialValues={finalValues}
            subscription={{ values: true }}
            onStateUpdate={saveSelectedApp}
            clearedValue={null}
        />
    );
};

export default AddApplication;
