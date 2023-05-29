import React, { cloneElement } from 'react';
import { useOutletContext } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useSource } from '../../hooks/useSource';
import RedirectNoWriteAccess from '../RedirectNoWriteAccess/RedirectNoWriteAccess';
import RedirectNoId from '../RedirectNoId/RedirectNoId';
import RedirectNoPaused from '../RedirectNoPaused/RedirectNoPaused';

const ElementWrapperInternal = ({ route, children }) => {
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

ElementWrapperInternal.propTypes = {
  route: PropTypes.shape({
    path: PropTypes.string.isRequired,
    redirectNoId: PropTypes.bool,
    writeAccess: PropTypes.bool,
    noPaused: PropTypes.bool,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

const ElementWrapper = ({ route, children }) => {
  const componentProps = useOutletContext();
  return <ElementWrapperInternal route={route}>{cloneElement(children, componentProps)}</ElementWrapperInternal>;
};

ElementWrapper.propTypes = {
  route: PropTypes.shape({
    path: PropTypes.string.isRequired,
    redirectNoId: PropTypes.bool,
    writeAccess: PropTypes.bool,
    noPaused: PropTypes.bool,
  }).isRequired,
  componentProps: PropTypes.any,
  children: PropTypes.node.isRequired,
};

export default ElementWrapper;
