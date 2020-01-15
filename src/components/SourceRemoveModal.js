import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
import { removeSource } from '../redux/actions/sources';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { FormattedMessage, useIntl } from 'react-intl';

import ApplicationList from './ApplicationsList/ApplicationList';
import RemoveAppModal from './AddApplication/RemoveAppModal';
import RedirectNoId from './RedirectNoId/RedirectNoId';
import { useSource } from '../hooks/useSource';

const SourceRemoveModal = () => {
    const { push } = useHistory();

    const [acknowledge, setAcknowledge] = useState(false);
    const [removingApp, setApplicationToRemove] = useState({});

    const intl = useIntl();
    const source = useSource();

    const dispatch = useDispatch();

    if (!source) {
        return <RedirectNoId/>;
    }

    const onSubmit = () => {
        push('/');
        dispatch(removeSource(source.id, intl.formatMessage({
            id: 'sources.notificationDeleteMessage',
            defaultMessage: `{title} was deleted successfully.`
        }, { title: source.name })));
    };

    const onCancel = () => push('/');

    const sourceHasActiveApp = source.applications.some((app) => !app.isDeleting);

    const actions = source.applications.length > 0 ? [
        <Button id="deleteCancel" key="cancel" variant="link" type="button" onClick={ onCancel }>
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
        <Button id="deleteCancel" key="cancel" variant="link" type="button" onClick={ onCancel }>
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
            {
                sourceHasActiveApp ? <ApplicationList
                    breakpoints={{ display_name: 8, remove: 4 }}
                    setApplicationToRemove={setApplicationToRemove}
                    namePrefix='- '
                /> : <Text component={ TextVariants.p }>
                    <FormattedMessage
                        id="sources.connectedApps"
                        defaultMessage="Connected applications are being removed."
                    />
                </Text>
            }
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
            isFooterLeftAligned
        >
            {removingApp.id && <RemoveAppModal
                app={removingApp}
                onCancel={() => setApplicationToRemove({})}
            />}
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

export default SourceRemoveModal;
