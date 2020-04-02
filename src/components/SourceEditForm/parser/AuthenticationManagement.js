import React, { useState } from 'react';
import { Button } from '@patternfly/react-core/dist/js/components/Button';
import { FormattedMessage } from 'react-intl';
import { GridItem } from '@patternfly/react-core/dist/js/layouts/Grid';
import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import TrashIcon from '@patternfly/react-icons/dist/js/icons/trash-icon';

import RemoveAuth from './RemoveAuth';

const AuthenticationManagement = ({ schemaAuth, source, auth, appTypes }) => {
    const [isRemoving, setRemove] = useState(false);
    const [isAttaching, setAttach] = useState(false);

    const attachedAppTypes = source.source.applications.filter(
        ({ authentications }) => authentications.find(({ id }) => id === auth.id)
    );

    const appNames = attachedAppTypes.map(
        ({ application_type_id }) => application_type_id ? appTypes.find(({ id }) => id === application_type_id) : undefined
    ).filter(Boolean).map(app => app.display_name);

    const description = `id: ${auth.id} ${appNames.length > 0 ? `used by ${appNames.join(', ')}` : 'not used by any app'}`;

    return (
        <React.Fragment>
            {isRemoving && <RemoveAuth onClose={() => setRemove(false)} appNames={ appNames } schemaAuth={schemaAuth}/>}
            <GridItem sm={12}>
                <Title size="xl">{schemaAuth.name}&nbsp;
                    <Button variant="plain" aria-label="Remove authentication" onClick={() => setRemove(!isRemoving)}>
                        <TrashIcon />
                    </Button>
                </Title>
                <TextContent>
                    <Text component={TextVariants.small} style={{ marginBottom: 0 }}>
                        {description}&nbsp;
                        <Button
                            variant="link"
                            type="button"
                            className="pf-u-pl-0"
                            onClick={() => setAttach(!isAttaching)}
                            style={{ fontSize: 'var(--pf-c-content--small--FontSize)' }}
                        >
                            <FormattedMessage
                                id="sources.assignAuth"
                                defaultMessage="+ assign to application"
                            />
                        </Button>
                    </Text>
                </TextContent>
            </GridItem>
        </React.Fragment>
    );
};

export default AuthenticationManagement;
