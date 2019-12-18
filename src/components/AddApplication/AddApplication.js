import React, { useReducer, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { Wizard, Text, TextVariants, TextContent, Button } from '@patternfly/react-core';

import { loadEntities } from '../../redux/actions/providers';
import SourcesFormRenderer from '../../Utilities/SourcesFormRenderer';
import createSchema from './AddApplicationSchema';
import LoadingStep from '../steps/LoadingStep';
import ErroredStep from '../steps/ErroredStep';
import FinishedStep from '../steps/FinishedStep';

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
                state: state.state !== 'finished' ? 'wizard' : 'finished',
                values: { source, endpoint: source.endpoints[0], url: endpointToUrl(source.endpoints[0]) }
            }));
        } else if (source) {
            setState({ state: state.state !== 'finished' ? 'wizard' : 'finished', values: { source } });
        }
    }, [source]);

    if (!appTypesLoaded || !sourceTypesLoaded || !loaded || state.state === 'loading') {
        return  (
            <Wizard
                isOpen={ true }
                onClose={() => history.push('/')}
                title={intl.formatMessage({
                    id: 'sources.manageApps',
                    defaultMessage: 'Manage applications'
                })}
                description={
                    intl.formatMessage({
                        id: 'sources.addAppDescription',
                        defaultMessage: 'You are managing applications of this source'
                    })
                }
                steps={ [{
                    name: 'Finish',
                    component: <LoadingStep />,
                    isFinishedStep: true
                }] }
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

    const goToSources = () => history.push(paths.sources);

    const onSubmitWrapper = (values, formApi) => onSubmit(
        values,
        formApi,
        state.authenticationsValues,
        dispatch,
        setState
    );

    const onSubmitFinal = filteredAppTypes.length > 0 ? onSubmitWrapper : goToSources;

    if (state.state !== 'wizard') {
        const shownStep = state.state === 'finished' ? (<FinishedStep
            onClose={goToSources}
            successfulMessage={<FormattedMessage
                id="sources.successAddApp"
                defaultMessage="Your application has been successfully added."
            />}
            title={<FormattedMessage
                id="sources.configurationSuccessful"
                defaultMessage="Configuration successful"
            />}
            secondaryActions={
                <Button variant="link" onClick={() => setState({ values: {}, state: 'wizard' })}>
                    <FormattedMessage
                        id="sources.continueManageApp"
                        defaultMessage="Continue managing applications"
                    />
                </Button>
            }
        />) : (<ErroredStep
            onClose={goToSources}
            message={
                <React.Fragment>
                    <FormattedMessage
                        id="sources.successAddApp"
                        defaultMessage="Your application has not been successfully added:"
                    />
                    <br />
                    <TextContent>
                        <Text component={TextVariants.h6}>{ state.error }</Text>
                    </TextContent>
                </React.Fragment>
            }
            title={<FormattedMessage
                id="sources.configurationSuccessful"
                defaultMessage="Configuration unsuccessful"
            />}
            onRetry={() => setState({ state: 'wizard' })}
        />);

        return (
            <Wizard
                isOpen={ true }
                onClose={goToSources}
                title={intl.formatMessage({
                    id: 'sources.manageApps',
                    defaultMessage: 'Manage applications'
                })}
                description={
                    intl.formatMessage({
                        id: 'sources.addAppDescription',
                        defaultMessage: 'You are managing applications of this source'
                    })
                }
                steps={ [{
                    name: 'Finish',
                    component: shownStep,
                    isFinishedStep: true
                }] } />
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
