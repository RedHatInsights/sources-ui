import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@data-driven-forms/pf4-component-mapper/checkbox';

const CheckboxWithIcon = ({ Icon, ...props }) => {
  const ref = useRef();

  return (
    <div className="ins-c-sources__checkbox-with-icon">
      <Checkbox {...props} type="checkbox" />
      <span ref={ref}>
        <Icon appendTo={ref.current} />
      </span>
    </div>
  );
};

CheckboxWithIcon.propTypes = {
  Icon: PropTypes.elementType.isRequired,
};

export default CheckboxWithIcon;
