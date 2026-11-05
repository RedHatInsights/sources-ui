import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, useIntl } from 'react-intl';

import { Button, Popover } from '@patternfly/react-core';

const messages = defineMessages({
  wizardShowmore: {
    id: 'wizard.showMore',
    defaultMessage: 'Show more',
  },
});

const ValuePopover = ({ label, value }) => {
  const intl = useIntl();

  return (
    <Popover headerContent={label} bodyContent={value} position="top" maxWidth="80%">
      <Button variant="link" isInline className="src-c-wizard__summary-buttons">
        {intl.formatMessage(messages.wizardShowmore)}
      </Button>
    </Popover>
  );
};

ValuePopover.propTypes = {
  label: PropTypes.node,
  value: PropTypes.node,
};

export default ValuePopover;
