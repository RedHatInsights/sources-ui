import React from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption } from '@data-driven-forms/pf4-component-mapper';
import { useFieldApi } from '@data-driven-forms/react-form-renderer';
import { SelectVariant } from '@patternfly/react-core/deprecated';

const SelectWithLink = ({ Link, ...originalProps }) => {
  const ref = React.useRef();

  const { label, input, isDisabled, options } = useFieldApi(originalProps);

  const selectOptions = () =>
    options.map(({ value, label, isDisabled }) => (
      <SelectOption key={value} value={value} isDisabled={isDisabled}>
        {label}
      </SelectOption>
    ));

  return (
    <div className="pf-v5-u-display-flex">
      <Select {...input} disabled={isDisabled} variant={SelectVariant.single} aria-label={label}>
        {selectOptions()}
      </Select>
      <span ref={ref}>
        <Link appendTo={ref.current} />
      </span>
    </div>
  );
};

SelectWithLink.propTypes = {
  isDisabled: PropTypes.bool,
  options: PropTypes.array,
  label: PropTypes.string.isRequired,
  Link: PropTypes.elementType.isRequired,
};

SelectWithLink.defaultProps = {
  isDisabled: false,
  options: [],
};

export default SelectWithLink;
