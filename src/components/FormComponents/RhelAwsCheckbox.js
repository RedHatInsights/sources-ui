import React from 'react';
import PropTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';

import { Checkbox } from '@patternfly/react-core';
import { useFlag } from '@unleash/proxy-client-react';

const RhelAwsCheckbox = ({ ...props }) => {
  const { label, input } = useFieldApi(props);
  const rhelAws = useFlag('platform.sources.metered-rhel');

  if (!rhelAws) {
    return null;
  }

  return (
    <Checkbox
      label={label}
      isChecked={input.value === 'rhel'}
      onChange={(_ev, checked) => {
        input.onChange(checked ? 'rhel' : undefined);
      }}
    />
  );
};

RhelAwsCheckbox.propTypes = {
  label: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
};

export default RhelAwsCheckbox;
