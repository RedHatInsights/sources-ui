import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@patternfly/react-core/dist/js/components/Button';
import { GridItem } from '@patternfly/react-core/dist/js/layouts/Grid';
import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import TrashIcon from '@patternfly/react-icons/dist/js/icons/trash-icon';

import RemoveAuth from './RemoveAuth';
import sourceEditContext from '../sourceEditContext';
import { FormattedMessage } from 'react-intl';

const AuthenticationManagement = ({ schemaAuth, auth, appTypes, isDeleting }) => {
    const { source } = useContext(sourceEditContext);
    const [isRemoving, setRemove] = useState(false);

    const attachedAppTypes = source.source.applications.filter(
        ({ authentications }) => authentications.find(({ id }) => id === auth.id)
    );

    const appNames = attachedAppTypes.map(
        ({ application_type_id }) => application_type_id ? appTypes.find(({ id }) => id === application_type_id) : undefined
    ).filter(Boolean).map(app => app.display_name);

    return (
        <React.Fragment>
            {isRemoving && <RemoveAuth
                auth={auth}
                onClose={() => setRemove(false)}
                appNames={ appNames }
                schemaAuth={schemaAuth}/>
            }
            <GridItem sm={12}>
                <Title size="xl">{schemaAuth.name}&nbsp;
                    {!isDeleting &&
                    <Button variant="plain" aria-label="Remove authentication" onClick={() => setRemove(!isRemoving)}>
                        <TrashIcon />
                    </Button>
                    }
                </Title>
                <TextContent>
                    <Text component={TextVariants.small} className="pf-u-mb-0">
                        <FormattedMessage
                            id="sources.removeAuthDescription"
                            defaultMessage="id: {authid} { appNames}"
                            values={{
                                authid: auth.id,
                                appNames: appNames.length > 0 ?
                                    <FormattedMessage
                                        id="sources.removeAuthWithApps"
                                        defaultMessage="used by {appNames}"
                                        values={{ appNames: appNames.join(', ') }}
                                    />
                                    : <FormattedMessage
                                        id="sources.removeAuthNoApps"
                                        defaultMessage="not used by any app"
                                    />
                            }}
                        />&nbsp;
                    </Text>
                </TextContent>
            </GridItem>
        </React.Fragment>
    );
};

AuthenticationManagement.propTypes = {
    isDeleting: PropTypes.bool,
    appTypes: PropTypes.arrayOf(PropTypes.object),
    schemaAuth: PropTypes.shape({
        name: PropTypes.string.isRequired
    }).isRequired,
    auth: PropTypes.shape({
        id: PropTypes.string.isRequired
    }).isRequired
};

export default AuthenticationManagement;
