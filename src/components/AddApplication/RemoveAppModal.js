import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux';
import {
    Button,
    Modal,
    TextContent,
    Stack,
    SplitItem,
    Split
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { loadEntities, addMessage } from '../../redux/actions/providers';
import { doDeleteApplication } from '../../api/entities';
import LoadingStep from '../steps/LoadingStep';

const RemoveAppModal = ({ app, onCancel, loadEntities, addMessage, intl }) => {
    const [isLoading, setLoading] = useState(false);

    const onSubmit = () => {
        setLoading(true);
        return doDeleteApplication(app.id).then(() =>
            loadEntities().then(() => {
                addMessage(intl.formatMessage({
                    id: 'sources.removeAppWarning',
                    defaultMessage: `{ name } was removed from this source.`
                },
                {
                    name: app.display_name
                }), 'success');
                onCancel();
            })
        ).catch(({ data: { errors: [{ detail }] } }) =>{
            addMessage(intl.formatMessage({
                id: 'sources.removeAppError',
                defaultMessage: `Removing of { name } application from this source was unsuccessful.`
            }, {
                name: app.display_name
            }), 'danger', detail);
            onCancel();
        });
    };

    return (
        <Modal
            className="ins-c-sources__dialog--warning"
            title={`Remove ${app.display_name} application`}
            isOpen={true}
            isSmall
            onClose={onCancel}
            actions={isLoading ? [] : [
                <Button
                    id="deleteSubmit" key="submit" variant="danger" type="button" onClick={ onSubmit }
                >
                    <FormattedMessage
                        id="sources.remove"
                        defaultMessage="Remove"
                    />
                </Button>,
                <Button id="deleteCancel" key="cancel" variant="secondary" type="button" onClick={ onCancel }>
                    <FormattedMessage
                        id="sources.cancel"
                        defaultMessage="Cancel"
                    />
                </Button>
            ]}
        >
            {isLoading ?
                <LoadingStep customText={
                    <FormattedMessage
                        id="sources.appIsBeingRemoved"
                        defaultMessage="The application is being removed."
                    />
                }/> :
                <Split gutter="md">
                    <SplitItem><ExclamationTriangleIcon size="xl" className="ins-m-alert ins-c-source__delete-icon" /></SplitItem>
                    <SplitItem isFilled>
                        <Stack gutter="md">
                            <TextContent>
                                <FormattedMessage
                                    id="sources.deleteAppWarning"
                                    defaultMessage={`Are you sure to remove { appName } from this source?`}
                                    values={{
                                        appName: app.display_name
                                    }}
                                />
                            </TextContent>
                        </Stack>
                    </SplitItem>
                </Split>
            }
        </Modal>
    );
};

RemoveAppModal.propTypes = {
    app: PropTypes.shape({
        id: PropTypes.string.isRequired,
        display_name: PropTypes.string.isRequired
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    loadEntities: PropTypes.func.isRequired,
    addMessage: PropTypes.func.isRequired,
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ loadEntities, addMessage }, dispatch);

export default connect(null, mapDispatchToProps)(injectIntl(RemoveAppModal));
