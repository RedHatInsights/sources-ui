import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Modal,
    Button,
    Bullseye,
    Text,
    TextContent,
    TextVariants,
    TextList,
    TextListItem,
    Checkbox
} from '@patternfly/react-core';
import { loadEntities, removeSource } from '../redux/actions/providers';
import { WarningTriangleIcon } from '@patternfly/react-icons';
import { FormattedMessage, injectIntl } from 'react-intl';

const SourceRemoveModal = ({
    history: { push },
    removeSource,
    loadEntities,
    source,
    intl
}) => {
    const onSubmit = () => removeSource(source.id, intl.formatMessage({
        id: 'sources.notificationDeleteMessage',
        defaultMessage: `{title} was deleted successfully.`
    }, { title: source.name }))
    .then(() => { loadEntities(); push('/'); });

    const onCancel = () => push('/');

    const [acknowledge, setAcknowledge] = useState(false);

    if (!source) {
        return null;
    }

    return (
        <Modal className="ins-c-sources__dialog--warning"
            title={
                intl.formatMessage({
                    id: 'sources.deleteTitle',
                    defaultMessage: `Delete {title}`
                }, { title: source.name })
            }
            isOpen
            isSmall
            onClose={ onCancel }
            actions={ [
                <Button
                    id="deleteSubmit" key="submit" variant="danger" type="button" onClick={ onSubmit } isDisabled={!acknowledge}
                >
                    <FormattedMessage
                        id="sources.deleteConfirm"
                        defaultMessage="Delete this source and its data"
                    />
                </Button>,
                <Button id="deleteCancel" key="cancel" variant="secondary" type="button" onClick={ onCancel }>
                    <FormattedMessage
                        id="sources.deleteCancel"
                        defaultMessage="Do not delete this source"
                    />
                </Button>
            ] }
        >
            <Bullseye>
                <TextContent>
                    <div className="ins-c-source__dialog--flex">
                        <div className="ins-c-source__dialog--icon">
                            <WarningTriangleIcon className="ins-c-source__delete-icon" />
                        </div>
                        <div className="ins-c-source__dialog--text">
                            <Text component={ TextVariants.p }>
                                <FormattedMessage
                                    id="sources.deleteTextBody"
                                    defaultMessage={`Are you sure that you want to delete "{ name }"?`}
                                    values={{
                                        name: source.name
                                    }}
                                />
                            </Text>
                            <Text component={ TextVariants.p }>
                                <FormattedMessage
                                    id="sources.delete-text-body-2"
                                    defaultMessage="Deleting this source will permanently delete:"
                                />
                            </Text>
                            <TextList>
                                <TextListItem>
                                    <FormattedMessage
                                        id="sources.deleteTextBody3"
                                        defaultMessage="All data collected"
                                    />
                                </TextListItem>
                                <TextListItem>
                                    <FormattedMessage
                                        id="sources.deleteTextBody4"
                                        defaultMessage="Any and all historical data"
                                    />
                                </TextListItem>
                            </TextList>
                            <Checkbox
                                label={intl.formatMessage({
                                    id: 'sources.deleteCheckboxTitle',
                                    defaultMessage: `I acknowledge that this action cannot be undone.`
                                })}
                                onChange={() => setAcknowledge((value) => !value)}
                                aria-label={
                                    intl.formatMessage({
                                        id: 'sources.deleteCheckboxTitle',
                                        defaultMessage: `I acknowledge that this action cannot be undone.`
                                    })
                                }
                                id="acknowledgeDelete"
                                name="acknowledgeDelete"
                                isChecked={acknowledge}
                            />
                        </div>
                    </div>
                </TextContent>
            </Bullseye>
        </Modal>
    );
};

SourceRemoveModal.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    removeSource: PropTypes.func.isRequired,
    loadEntities: PropTypes.func.isRequired,
    source: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }),
    intl: PropTypes.object
};

const sourceDetailsFromState = (state, id) => state.providers.entities.find(source => source.id  === id);

const mapStateToProps = (state, { match: { params: { id } } }) => ({ source: sourceDetailsFromState(state, id) });

const mapDispatchToProps = (dispatch) => bindActionCreators({
    loadEntities,
    removeSource
}, dispatch);

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(SourceRemoveModal)));
