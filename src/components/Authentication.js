import React, { useState, useEffect, useRef } from 'react';
import get from 'lodash/get';

import { FormGroup, TextInput } from '@patternfly/react-core';

import TextField from '@data-driven-forms/pf4-component-mapper/text-field';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

import validated from '../utilities/resolveProps/validated';

const Authentication = (rest) => {
  const formOptions = useFormApi();
  const values = formOptions.getState().values;

  const [authenticationId] = rest?.name?.match(/\d+/) || [];
  const isEditing = authenticationId || values.authentication?.id;

  // If there is any value, the field is modified (password is always empty on start)
  let isModified = get(values, rest.name);

  const [edited, setEdited] = useState(!isEditing || isModified);
  const firstClick = useRef(true);
  const mounted = useRef(false);

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

  if (!edited && isEditing) {
    return (
      <FormGroup helperText={componentProps.helperText} label={componentProps.label} onFocus={() => setEdited(true)} isRequired>
        <TextInput aria-label="pre-filled-authentication" value="•••••••••••••" />
      </FormGroup>
    );
  }

  return <TextField {...componentProps} autoFocus={true} />;
};

export default Authentication;
