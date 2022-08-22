import React, { useEffect } from 'react';

import { FormGroup, Stack, StackItem, Switch } from '@patternfly/react-core';

import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

const SwitchGroup = (props) => {
  const { label, input, options, applicationTypes } = useFieldApi(props);
  const { getState } = useFormApi();

  const selectedType = getState().values.source_type;
  const supportedApps = applicationTypes
    .filter(({ supported_source_types }) => supported_source_types.includes(selectedType))
    .map(({ id }) => id);
  const filteredOptions = options.filter(({ value }) => supportedApps.includes(value));

  const handleChange = (checked, value) =>
    checked ? input.onChange([...input.value, value]) : input.onChange(input.value.filter((x) => x !== value));

  useEffect(() => {
    if (!input.value) {
      input.onChange(filteredOptions.map(({ value }) => value).filter(Boolean));
    }
  }, []);

  return (
    <FormGroup label={label} fieldId={input.name}>
      <Stack hasGutter>
        {filteredOptions.map((option) => (
          <StackItem key={option.value}>
            <Switch
              label={option.label}
              onChange={(checked) => handleChange(checked, option.value)}
              isChecked={input.value.includes(option.value)}
              id={option.value}
            />
            {option.description && (
              <div className="pf-c-switch pf-u-mt-sm">
                <span className="pf-c-switch__toggle src-m-wizard-hide-me" />
                <div className="pf-c-switch__label src-c-wizard--switch-description">{option.description}</div>
              </div>
            )}
          </StackItem>
        ))}
      </Stack>
    </FormGroup>
  );
};

export default SwitchGroup;
