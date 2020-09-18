import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { FormGroup } from '@patternfly/react-core/dist/js/components/Form/FormGroup';
import { Text } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { Tooltip } from '@patternfly/react-core/dist/js/components/Tooltip/Tooltip';

import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon';

const AuthenticationId = ({ id }) => {
    const intl = useIntl();

    return (<FormGroup
        label={intl.formatMessage({ id: 'sources.authId', defaultMessage: 'Authentication ID' })}
        labelIcon={
            <Tooltip
                position="top"
                content={
                    intl.formatMessage({
                        id: 'sources.authNotUsed',
                        defaultMessage: 'This authentication is not used by any application'
                    })
                }
            >
                <OutlinedQuestionCircleIcon />
            </Tooltip>
        }
    >
        <TextContent>
            <Text variant="p">
                {id}
            </Text>
        </TextContent>
    </FormGroup>);
};

AuthenticationId.propTypes = {
    id: PropTypes.string.isRequired
};

export default AuthenticationId;
