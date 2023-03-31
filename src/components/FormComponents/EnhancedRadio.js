import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import Radio from '@data-driven-forms/pf4-component-mapper/radio';
import { NO_APPLICATION_VALUE } from '../../components/addSourceWizard/stringConstants';

const EnhancedRadio = ({ options, mutator, className, ...props }) => {
  const formOptions = useFormApi();

  const values = formOptions.getState().values;

  const selectedType = values.source_type;
  const selectedApp = get(values, props.name);

  let newOptions = options.map((option) => mutator(option, formOptions)).filter(Boolean);

  if (selectedType === 'oracle-cloud-infrastructure') {
    newOptions = newOptions.filter((option) => option.value && option.value !== NO_APPLICATION_VALUE);
  }

  useEffect(() => {
    if (
      selectedType &&
      (!selectedApp || !newOptions.map(({ value }) => value).includes(selectedApp)) &&
      newOptions.filter((option) => option.value && option.value !== NO_APPLICATION_VALUE).length === 1
    ) {
      formOptions.change(props.name, newOptions[0].value);
    } else if (!newOptions.map(({ value }) => value).includes(selectedApp)) {
      formOptions.change(props.name, NO_APPLICATION_VALUE);
    }

    if (
      selectedType === 'oracle-cloud-infrastructure' &&
      newOptions.filter((option) => option.value && option.value !== NO_APPLICATION_VALUE)
    ) {
      formOptions.change(props.name, newOptions[0].value);
    }
  }, [selectedType]);

  return <Radio {...props} options={newOptions} FormGroupProps={{ className: className ?? 'src-c-wizard__radio' }} />;
};

EnhancedRadio.propTypes = {
  mutator: PropTypes.func.isRequired,
  options: PropTypes.array,
  name: PropTypes.string,
  className: PropTypes.string,
};

export default EnhancedRadio;
