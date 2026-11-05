import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, useIntl } from 'react-intl';

import { FormHelperText, Spinner } from '@patternfly/react-core';

import FormSpy from '@data-driven-forms/react-form-renderer/form-spy';

const messages = defineMessages({
  wizardValidating: {
    id: 'wizard.validating',
    defaultMessage: 'Validating',
  },
});

export const ValidatingSpinner = ({ validating }) => {
  const intl = useIntl();

  return (
    <FormHelperText isHidden={!validating}>
      <Spinner size="md" className="pf-v6-u-mr-md" />
      {intl.formatMessage(messages.wizardValidating)}
    </FormHelperText>
  );
};

ValidatingSpinner.propTypes = {
  validating: PropTypes.bool.isRequired,
};

const validated = (_, { meta }) => {
  if (meta.validating) {
    return {
      // FormSpy is a fallback solution
      // FF sometimes does not set validating to 'false' on the field
      // So we need to also check the FormSpy.validating
      helperText: <FormSpy>{({ validating }) => <ValidatingSpinner validating={validating} />}</FormSpy>,
    };
  }

  if (meta.valid) {
    return {
      validated: 'success',
      FormGroupProps: {
        validated: 'success',
      },
    };
  }

  return {};
};

export default validated;
