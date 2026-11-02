import { defineMessages, useIntl } from 'react-intl';
import React, { useEffect, useRef, useState } from 'react';
import get from 'lodash/get';

import { FormGroup, TextInput } from '@patternfly/react-core';

import TextField from '@data-driven-forms/pf4-component-mapper/text-field';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

import validated from '../utilities/resolveProps/validated';

const messages = defineMessages({
  filledPasswordAria: {
    id: 'auth.filledPasswordAria',
    defaultMessage: 'Filled password',
  },
});

const Authentication = (rest) => {
  const intl = useIntl();
  const formOptions = useFormApi();
  const values = formOptions.getState().values;

  const [authenticationId] = rest?.name?.match(/\d+/) || [];
  const isEditing = authenticationId || values.authentication?.id;

  // If there is any value, the field is modified (password is always empty on start)
  let isModified = get(values, rest.name);

  const [edited, setEdited] = useState(!isEditing || isModified);
  const firstClick = useRef(true);
  const mounted = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- pre-existing pattern, see i18n cleanup ticket
  useEffect(() => {
    if (mounted.current) {
      // reset on restart
      if (!firstClick.current && formOptions.getState().pristine) {
        setEdited(false);
        firstClick.current = true;
      }

      if (edited) {
        firstClick.current = false;
      }
    }
  });

  useEffect(() => {
    mounted.current = true;
  }, []);

  const doNotRequirePassword = rest.validate && rest.validate.filter(({ type }) => type !== validatorTypes.REQUIRED);

  const componentProps = {
    ...rest,
    ...(isEditing
      ? {
          validate: doNotRequirePassword,
          resolveProps: validated,
        }
      : {}),
  };

  if (rest.isDisabled) {
    return (
      <FormGroup helperText={componentProps.helperText} label={componentProps.label} isRequired>
        <TextInput aria-label={intl.formatMessage(messages.filledPasswordAria)} value="•••••••••••••" isDisabled />
      </FormGroup>
    );
  }

  if (!edited && isEditing) {
    return (
      <FormGroup helperText={componentProps.helperText} label={componentProps.label} onFocus={() => setEdited(true)} isRequired>
        <TextInput aria-label={intl.formatMessage(messages.filledPasswordAria)} value="•••••••••••••" />
      </FormGroup>
    );
  }

  return <TextField {...componentProps} autoFocus={true} />;
};

export default Authentication;
