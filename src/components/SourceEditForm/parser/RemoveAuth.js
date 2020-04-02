import React from 'react';

import { Modal } from '@patternfly/react-core/dist/js/components/Modal';
import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { Split } from '@patternfly/react-core/dist/js/layouts/Split/Split';
import { SplitItem } from '@patternfly/react-core/dist/js/layouts/Split/SplitItem';
import { Stack } from '@patternfly/react-core/dist/js/layouts/Stack/Stack';
import { Checkbox } from '@patternfly/react-core/dist/js/components/Checkbox/Checkbox';
import { TextList } from '@patternfly/react-core/dist/js/components/Text/TextList';
import { TextListItem } from '@patternfly/react-core/dist/js/components/Text/TextListItem';

import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import { FormattedMessage } from 'react-intl';

const RemoveAuth = ({ onClose, appNames, schemaAuth }) => {
    const hasAttachedApp = appNames.length > 0;
    let body;
    let actions;

    if (hasAttachedApp) {
        body = `To remove this authentication you have to remove attached applications: ${appNames.join(', ')}`;
        actions = [<Button
            id="deleteCancel"
            key="cancel"
            variant="link"
            type="button"
            onClick={ onClose }
        >
            <FormattedMessage
                id="sources.close"
                defaultMessage="Close"
            />
        </Button>];
    } else {
        body = 'Do you really want to remove this authentication?';
        actions = [<Button
            id="deleteSubmit"
            key="submit"
            variant="danger"
            type="button"
            onClick={ () => {} }
        >
            <FormattedMessage
                id="sources.deleteConfirm"
                defaultMessage="Delete this authentication"
            />
        </Button>,
        <Button
            id="deleteCancel"
            key="cancel"
            variant="link"
            type="button"
            onClick={ onClose }
        >
            <FormattedMessage
                id="sources.deleteCancel"
                defaultMessage="Do not delete this authentication"
            />
        </Button>];
    }

    return (
        <Modal
            isOpen
            className="ins-c-sources__dialog--warning"
            isFooterLeftAligned
            onClose={onClose}
            actions={actions}
            isSmall
            title={`Delete ${schemaAuth.name}`}
        >
            <Split gutter="md">
                <SplitItem>
                    <ExclamationTriangleIcon size="xl" className="ins-m-alert ins-c-source__delete-icon" />
                </SplitItem>
                <SplitItem isFilled>
                    <Stack gutter="md">
                        <TextContent>
                            {body}
                        </TextContent>
                    </Stack>
                </SplitItem>
            </Split>
        </Modal>
    );
};

export default RemoveAuth;
