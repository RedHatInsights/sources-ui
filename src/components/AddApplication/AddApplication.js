import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Wizard, Text, TextVariants, TextContent, Button } from '@patternfly/react-core';

import { addAppToSource } from '../../redux/actions/providers';
import SourcesFormRenderer from '../../Utilities/SourcesFormRenderer';
import createSchema from './AddApplicationSchema';
import LoadingStep from '../steps/LoadingStep';
import ErroredStep from '../steps/ErroredStep';
import FinishedStep from '../steps/FinishedStep';

import { doCreateApplication } from '../../api/entities';

const initialState = {
    state: 'wizard',
    error: '',
    values: {}
};

const reducer = (state, payload) => ({ ...state, ...payload });

const AddApplication = (
    { source, appTypes, history, addAppToSource, intl, appTypesLoaded, sourceTypesLoaded, sourceTypes }
) => {
    const [state, setState] = useReducer(reducer, initialState);

    if (!source || !appTypesLoaded || !sourceTypesLoaded) {
        return null;
    }

    const appIds = source.applications.filter(({ isDeleting }) => !isDeleting)
    .reduce((acc, app) => [...acc, app.application_type_id], []);

    const sourceType = sourceTypes.find((type) => type.id === source.source_type_id);
    const sourceTypeName = sourceType && sourceType.name;
    const filteredAppTypes = appTypes.filter((type) =>
        !appIds.includes(type.id) && type.supported_source_types.includes(sourceTypeName)
    );

    const schema = createSchema(filteredAppTypes.map((type) => {
        const hasDeletingApp = source.applications.find(app => app.application_type_id === type.id);
        const label = `${type.display_name} ${hasDeletingApp ? `(${intl.formatMessage({
            id: 'sources.currentlyRemoving',
            defaultMessage: 'Currently removing'
        })})` : ''}`;
        return ({ value: type.id, label, isDisabled: hasDeletingApp ? true : false });
    }), intl);

    const onSubmit = ({ application }) => {
        setState({ state: 'loading' });
        return doCreateApplication(source.id, application).then((app) => {
            setState({ state: 'finished' });
            addAppToSource(source.id, app);
        })
        .catch(({ data: { errors: [{ detail }] } }) => {
            setState({
                state: 'errored',
                error: detail,
                values: { application }
            });
        });
    };

    if (state.state !== 'wizard') {
        return (
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
                    component: state.state === 'loading' ? <LoadingStep />
                        : state.state === 'finished' ? <FinishedStep
                            onClose={() => history.push('/')}
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
                        /> : <ErroredStep
                            onClose={() => history.push('/')}
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
                        />,
                    isFinishedStep: true
                }] } />
        );
    }

    return (
        <SourcesFormRenderer
            schema={schema}
            showFormControls={false}
            onSubmit={filteredAppTypes.length > 0 ? onSubmit : () => history.push('/')}
            onCancel={() => history.push('/')}
            initialValues={state.values}
        />
    );
};

AddApplication.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    addAppToSource: PropTypes.func.isRequired,
    source: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }),
    intl: PropTypes.object,
    appTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        display_name: PropTypes.string.isRequired,
        supported_source_types: PropTypes.arrayOf(PropTypes.string)
    })),
    sourceTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        product_name: PropTypes.string.isRequired
    })),
    appTypesLoaded: PropTypes.bool.isRequired,
    sourceTypesLoaded: PropTypes.bool.isRequired
};

const mapStateToProps = (
    { providers: { entities, appTypes, appTypesLoaded, sourceTypesLoaded, sourceTypes } },
    { match: { params: { id } } }
) =>
    (
        { source: entities.find(source => source.id  === id), appTypes, appTypesLoaded, sourceTypesLoaded, sourceTypes }
    );

const mapDispatchToProps = (dispatch) => bindActionCreators({ addAppToSource }, dispatch);

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(AddApplication)));
