import React from 'react';
import PropTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';

import { Checkbox } from '@patternfly/react-core';
import { usePreviewFlag } from '../../utilities/usePreviewFlag';

const RhelAwsCheckbox = ({ ...props }) => {
  const { label, input } = useFieldApi(props);
  const rhelAws = usePreviewFlag('platform.sources.metered-rhel');

  if (!rhelAws) {
    return null;
  }

  return (
    <Checkbox
      label={label}
      isChecked={input.value === 'rhel'}
      onChange={(checked) => {
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
