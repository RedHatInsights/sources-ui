import React from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption, SelectVariant } from '@data-driven-forms/pf4-component-mapper/select';
import { useFieldApi } from '@data-driven-forms/react-form-renderer';

const SelectWithLink = (Link, ...props) => {
  const ref = React.useRef();

  const { label, input, isDisabled, options } = useFieldApi(props);

  const selectOptions = options.map((option) => (
    <SelectOption key={option.value} value={option.value}>
      {option.label}
    </SelectOption>
  ));

  return (
    <div className="pf-v5-u-display-flex">
      <Select {...input} disabled={isDisabled} variant={SelectVariant.single} aria-label={label}>
        {selectOptions}
      </Select>
      <span ref={ref}>
        <Link appendTo={ref.current} />
      </span>
    </div>
  );
};

SelectWithLink.propTypes = {
  isDisabled: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      value: PropTypes.any,
    }),
  ).isRequired,
  label: PropTypes.string.isRequired,
  Link: PropTypes.elementType.isRequired,
};

export default SelectWithLink;
