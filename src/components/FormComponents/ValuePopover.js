import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Button, Popover } from '@patternfly/react-core';

const ValuePopover = ({ label, value }) => {
  const intl = useIntl();

  return (
    <Popover headerContent={label} bodyContent={value} position="top" maxWidth="80%">
      <Button variant="link" isInline className="src-c-wizard__summary-buttons">
        {intl.formatMessage({
          id: 'wizard.showMore',
          defaultMessage: 'Show more',
        })}
      </Button>
    </Popover>
  );
};

ValuePopover.propTypes = {
  label: PropTypes.node,
  value: PropTypes.node,
};

export default ValuePopover;
