import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';

export const Content = ({ authtype }) => {
    const intl = useIntl();

    return (
        <TextContent>
            <Text component={ TextVariants.p }>
                { intl.formatMessage({
                    id: 'sources.unsupportedAuthType',
                    defaultMessage: 'Authentication type of { authtype } is no longer supported.'
                }, { authtype }) }
            </Text>
        </TextContent>
    );
};

Content.propTypes = {
    authtype: PropTypes.string
};

export const unsupportedAuthTypeField = (authtype) => ({
    component: 'description',
    name: `${authtype}-unsupported`,
    authtype,
    Content
});
