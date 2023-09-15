import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@data-driven-forms/pf4-component-mapper/checkbox';

const CheckboxWithLink = ({ Link, ...props }) => {
  const ref = useRef();

  return (
    <div className="pf-u-display-flex">
      <Checkbox {...props} type="checkbox" />
      <span ref={ref}>
        <Link appendTo={ref.current} />
      </span>
    </div>
  );
};

CheckboxWithLink.propTypes = {
  Link: PropTypes.elementType.isRequired,
};

export default CheckboxWithLink;
