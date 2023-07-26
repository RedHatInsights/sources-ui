import React from 'react';
import { Navigate } from 'react-router-dom';
import { linkBasename, mergeToBasename } from '../../utilities/utils';
import PropTypes from 'prop-types';

const AppNavigate = (props) => <Navigate {...props} to={mergeToBasename(props.to, linkBasename)} />;
AppNavigate.displayName = 'AppNavigate';

AppNavigate.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default AppNavigate;
