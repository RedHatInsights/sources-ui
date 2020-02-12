import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';

export const unsupportedAuthTypeField = (type) => ({
    component: 'description',
    name: `${type}-unsupported`,
    // eslint-disable-next-line react/display-name
    Content: () => (
        <TextContent>
            <Text component={ TextVariants.p }>
                <FormattedMessage
                    id="sources.unsupportedAuthType"
                    defaultMessage={`Authentication type of { type } is no longer supported.`}
                    values={{ type }}
                />
            </Text>
        </TextContent>
    )
});
