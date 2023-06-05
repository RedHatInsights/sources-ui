import React from 'react';
import { Link } from 'react-router-dom';
import { linkBasename, mergeToBasename } from '../../utilities/utils';
import PropTypes from 'prop-types';

const AppLink = React.forwardRef((props, ref) => <Link {...props} ref={ref} to={mergeToBasename(props.to, linkBasename)} />);
AppLink.displayName = 'AppLink';

AppLink.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default AppLink;
