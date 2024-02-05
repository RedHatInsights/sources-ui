import React from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';

const SelectWithLink = (Link, options, ...props) => {
  const ref = React.useRef();

  const selectOptions = options.map((option) => (
    <SelectOption key={option.value} value={option.value} description={option.description} />
  ));

  return (
    <div className="pf-v5-u-display-flex">
      <Select variant={SelectVariant.single} {...props}>
        {selectOptions}
      </Select>
      <span ref={ref}>
        <Link appendTo={ref.current} />
      </span>
    </div>
  );
};

SelectWithLink.propTypes = {
  Link: PropTypes.elementType.isRequired,
};

export default SelectWithLink;
