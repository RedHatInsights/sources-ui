import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Modal,
    Button,
    Split,
    SplitItem,
    Stack,
    Text,
    TextContent,
    TextVariants,
    TextList,
    TextListItem,
    Checkbox
} from '@patternfly/react-core';
import { removeSource } from '../redux/actions/providers';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { FormattedMessage, injectIntl } from 'react-intl';

const SourceRemoveModal = ({
    history: { push },
    removeSource,
    source,
    intl,
    appTypes
}) => {
    const onSubmit = () => {
        push('/');
        return removeSource(source.id, intl.formatMessage({
            id: 'sources.notificationDeleteMessage',
            defaultMessage: `{title} was deleted successfully.`
        }, { title: source.name }));
    };

    const onCancel = () => push('/');

    const [acknowledge, setAcknowledge] = useState(false);

    if (!source) {
        return null;
    }

    const appNames = source.applications.map((app) => {
        const type = appTypes.find((appType) => appType.id === app.application_type_id);

        if (type) {
            return type.display_name;
        }
    }).map((name) => (
        <Text key={name} component={TextVariants.p} style={{ marginBottom: 0 }}>
            - {name}
        </Text>
    ));

    const actions = source.applications.length > 0 ? [
        <Button id="deleteCancel" key="cancel" variant="secondary" type="button" onClick={ onCancel }>
            <FormattedMessage
                id="sources.close"
                defaultMessage="Close"
            />
        </Button>
    ] : [
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
    ];

    const body = source.applications.length > 0 ? (
        <React.Fragment>
            <Text component={ TextVariants.p }>
                <FormattedMessage
                    id="sources.deleteTextBodyWithApp"
                    defaultMessage="This action cannot be enacted until all assigned
                    applications have been removed from this source."
                />
            </Text>
            <Button
                variant="link"
                isInline
                onClick={ (_ev) => push(`/manage_apps/${source.id}`)}
            >
                <Text component={ TextVariants.p } style={{ marginBottom: 0 }}>
                    <FormattedMessage
                        id="sources.connectedApps"
                        defaultMessage="Connected applications:"
                    />
                </Text>
            </Button>
            { appNames }
        </React.Fragment>
    ) : (
        <React.Fragment>
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
        </React.Fragment>
    );

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
            actions={ actions }
        >
            <Split gutter="md">
                <SplitItem><ExclamationTriangleIcon size="xl" className="ins-m-alert ins-c-source__delete-icon" /></SplitItem>
                <SplitItem isFilled>
                    <Stack gutter="md">
                        <TextContent>
                            { body }
                        </TextContent>
                    </Stack>
                </SplitItem>
            </Split>
        </Modal>
    );
};

SourceRemoveModal.propTypes = {
    appTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        display_name: PropTypes.string.isRequired
    })),
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    removeSource: PropTypes.func.isRequired,
    source: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }),
    intl: PropTypes.object
};

const mapStateToProps = ({ providers: { entities, appTypes } }, { match: { params: { id } } }) =>
    ({ source: entities.find(source => source.id  === id), appTypes });

const mapDispatchToProps = (dispatch) => bindActionCreators({ removeSource }, dispatch);

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(SourceRemoveModal)));
