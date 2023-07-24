import React from 'react';
import PropTypes from 'prop-types';
import { ClipboardCopy as ClipboardCopyPF, FormGroup } from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';

const ClipboardCopy = (props) => {
  const { label, input } = useFieldApi(props);

  return (
    <FormGroup label={label}>
      <ClipboardCopyPF label={label} isReadOnly>
        {input.value}
      </ClipboardCopyPF>
    </FormGroup>
  );
};

ClipboardCopyPF.propTypes = {
  label: PropTypes.string,
};

export default ClipboardCopy;
