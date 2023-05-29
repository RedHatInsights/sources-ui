import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useSource } from '../../hooks/useSource';
import RedirectNoWriteAccess from '../RedirectNoWriteAccess/RedirectNoWriteAccess';
import RedirectNoId from '../RedirectNoId/RedirectNoId';
import RedirectNoPaused from '../RedirectNoPaused/RedirectNoPaused';

const CustomRouteInternal = ({ route, children }) => {
  const source = route.redirectNoId && useSource();

  if (!source && route.redirectNoId) {
    return <RedirectNoId />;
  }

  return (
    <React.Fragment>
      {route.noPaused && <RedirectNoPaused />}
      {route.writeAccess && <RedirectNoWriteAccess />}
      {children}
    </React.Fragment>
  );
};

CustomRouteInternal.propTypes = {
  route: PropTypes.shape({
    path: PropTypes.string.isRequired,
    redirectNoId: PropTypes.bool,
    writeAccess: PropTypes.bool,
    noPaused: PropTypes.bool,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

const CustomRoute = ({ route, componentProps, Component, ...props }) => (
  <Routes>
    <Route
      {...props}
      path={route.path}
      element={
        <CustomRouteInternal route={route}>
          <Component {...componentProps} />
        </CustomRouteInternal>
      }
    />
  </Routes>
);

CustomRoute.propTypes = {
  route: PropTypes.shape({
    path: PropTypes.string.isRequired,
    redirectNoId: PropTypes.bool,
    writeAccess: PropTypes.bool,
    noPaused: PropTypes.bool,
  }).isRequired,
  componentProps: PropTypes.any,
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
};

export default CustomRoute;
