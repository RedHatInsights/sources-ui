import React, { useReducer, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useIntl } from 'react-intl';

import { loadEntities } from '../../redux/actions/providers';
import SourcesFormRenderer from '../../Utilities/SourcesFormRenderer';
import createSchema from './AddApplicationSchema';
import LoadingStep from '../steps/LoadingStep';
import ErroredStep from './steps/ErroredStep';
import FinishedStep from './steps/FinishedStep';
import WizardBody from './WizardBody';

import { getSourcesApi } from '../../api/entities';

import RedirectNoId from '../RedirectNoId/RedirectNoId';
import { useSource } from '../../hooks/useSource';
import { endpointToUrl } from '../SourcesSimpleView/formatters';
import { paths } from '../../Routes';

import { doAttachApp } from '../../api/doAttachApp';

export const onSubmit = (values, formApi, authenticationInitialValues, dispatch, setState) => {
    setState({ state: 'loading' });
    return doAttachApp(values, formApi, authenticationInitialValues).then(() => {
        setState({ state: 'finished' });
        dispatch(loadEntities());
    })
    .catch(error => {
        setState({
            state: 'errored',
            error,
            values: formApi.getState().values
        });
    });
};

const initialState = {
    state: 'loading',
    error: '',
    values: {},
    authenticationsValues: []
};

const reducer = (state, payload) => ({ ...state, ...payload });

const AddApplication = () => {
    const intl = useIntl();
    const { id } = useParams();
    const history = useHistory();

    const {
        appTypes,
        sourceTypesLoaded,
        appTypesLoaded,
        sourceTypes,
        loaded
    } = useSelector(({ providers }) => providers, shallowEqual);

    const source = useSource(id);

    const dispatch = useDispatch();

    const [state, setState] = useReducer(reducer, initialState);

    useEffect(() => {
        if (source && source.endpoints && source.endpoints[0]) {
            getSourcesApi()
            .listEndpointAuthentications(source.endpoints[0].id)
            .then(({ data }) => setState({
                authenticationsValues: data,
                state: state.state === 'loading' ? 'wizard' : state.state,
                values: {
                    source,
                    endpoint: source.endpoints[0],
                    url: endpointToUrl(source.endpoints[0])
                }
            }));
        } else if (source) {
            setState({
                state: state.state === 'loading' ? 'wizard' : state.state,
                values: { source }
            });
        }
    }, [source]);

    const goToSources = () => history.push(paths.sources);

    if (!appTypesLoaded || !sourceTypesLoaded || !loaded || state.state === 'loading') {
        return  (
            <WizardBody
                goToSources={goToSources}
                step={<LoadingStep />}
            />
        );
    }

    if (!source) {
        return <RedirectNoId />;
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
        setState
    );

    const onSubmitFinal = filteredAppTypes.length > 0 ? onSubmitWrapper : goToSources;

    if (state.state !== 'wizard') {
        const shownStep = state.state === 'finished' ? (<FinishedStep setState={setState} goToSources={goToSources}/>) :
            (<ErroredStep setState={setState} goToSources={goToSources} error={state.error}/>);

        return (
            <WizardBody goToSources={goToSources} step={shownStep} />
        );
    }

    return (
        <SourcesFormRenderer
            schema={schema}
            showFormControls={false}
            onSubmit={onSubmitFinal}
            onCancel={goToSources}
            initialValues={state.values}
            subscription={{ values: true }}
        />
    );
};

export default AddApplication;
