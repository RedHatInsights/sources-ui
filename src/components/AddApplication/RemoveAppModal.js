import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl, FormattedMessage } from 'react-intl';
import {
    Button,
    Modal,
    TextContent,
    Stack,
    SplitItem,
    Split,
    Text,
    TextVariants
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { withRouter } from 'react-router-dom';

import { removeApplication } from '../../redux/actions/providers';
import RedirectNoId from '../RedirectNoId/RedirectNoId';
import { useSource } from '../../hooks/useSource';

const RemoveAppModal = ({ app, onCancel, match: { params: { id } } }) => {
    const intl = useIntl();

    const appTypes = useSelector(({ providers }) => providers.appTypes);
    const source = useSource(id);

    const dispatch = useDispatch();

    if (!source) {
        return <RedirectNoId/>;
    }

    const dependentApps = app.dependent_applications.map(appName => {
        const appType = appTypes.find(({ name }) => name === appName);

        return appType ? app.sourceAppsNames.includes(appType.display_name) ? appType.display_name : undefined : undefined;
    }).filter(x => x);

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
        return dispatch(removeApplication(app.id, source.id, titleSuccess, titleError));
    };

    return (
        <Modal
            className="ins-c-sources__dialog--warning"
            title={`Remove ${app.display_name} application`}
            isOpen={true}
            isSmall
            onClose={onCancel}
            isFooterLeftAligned
            actions={[
                <Button
                    id="deleteSubmit" key="submit" variant="danger" type="button" onClick={ onSubmit }
                >
                    <FormattedMessage
                        id="sources.remove"
                        defaultMessage="Remove"
                    />
                </Button>,
                <Button id="deleteCancel" key="cancel" variant="link" type="button" onClick={ onCancel }>
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
                            <Text component={TextVariants.p}>
                                <FormattedMessage
                                    id="sources.deleteAppWarning"
                                    defaultMessage={`Are you sure to remove { appName } from this source?`}
                                    values={{
                                        appName: app.display_name
                                    }}
                                />
                            </Text>
                            {dependentApps.length > 0 && <Text component={TextVariants.p}>
                                <FormattedMessage
                                    id="sources.deleteAppDetails"
                                    defaultMessage={`This change will affect these applications: { apps }.`}
                                    values={{
                                        apps: dependentApps
                                    }}
                                />
                            </Text>}
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
        display_name: PropTypes.string.isRequired,
        dependent_applications: PropTypes.arrayOf(PropTypes.string),
        sourceAppsNames: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default withRouter(RemoveAppModal);
