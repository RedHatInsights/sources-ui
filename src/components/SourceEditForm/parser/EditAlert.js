import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';

import { Alert } from '@patternfly/react-core/dist/js/components/Alert/Alert';

const EditAlert = ({ name }) => {
  const formOptions = useFormApi();

  const { variant, title, description } = get(formOptions.getState().values, name);

  return (
    <Alert variant={variant} isInline title={title}>
      {description}
    </Alert>
  );
};

EditAlert.propTypes = {
  name: PropTypes.string.isRequired,
};

export default EditAlert;
