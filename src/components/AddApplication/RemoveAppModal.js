import React from 'react';
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
import { removeApplication } from '../../redux/actions/providers';

const RemoveAppModal = ({ app, onCancel, intl, removeApplication, sourceId }) => {
    const onSubmit = () => {
        const titleSuccess = intl.formatMessage({
            id: 'sources.removeAppWarning',
            defaultMessage: `{ name } was removed from this source.`
        },
        {
            name: app.display_name
        });
        const titleError = intl.formatMessage({
            id: 'sources.removeAppError',
            defaultMessage: `Removing of { name } application from this source was unsuccessful.`
        }, {
            name: app.display_name
        });
        onCancel();
        return removeApplication(app.id, sourceId, titleSuccess, titleError);
    };

    return (
        <Modal
            className="ins-c-sources__dialog--warning"
            title={`Remove ${app.display_name} application`}
            isOpen={true}
            isSmall
            onClose={onCancel}
            actions={[
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
        </Modal>
    );
};

RemoveAppModal.propTypes = {
    app: PropTypes.shape({
        id: PropTypes.string.isRequired,
        display_name: PropTypes.string.isRequired
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    removeApplication: PropTypes.func.isRequired,
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired,
    sourceId: PropTypes.string.isRequired
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ removeApplication }, dispatch);

export default connect(null, mapDispatchToProps)(injectIntl(RemoveAppModal));
