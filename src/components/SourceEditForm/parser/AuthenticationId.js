import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { FormGroup } from '@patternfly/react-core/dist/js/components/Form/FormGroup';
import { Text } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';

const AuthenticationId = ({ id }) => {
  const intl = useIntl();

  return (
    <FormGroup
      label={intl.formatMessage({
        id: 'sources.authId',
        defaultMessage: 'Authentication ID',
      })}
    >
      <TextContent>
        <Text variant="p">{id}</Text>
      </TextContent>
    </FormGroup>
  );
};

AuthenticationId.propTypes = {
  id: PropTypes.string.isRequired,
};

export default AuthenticationId;
