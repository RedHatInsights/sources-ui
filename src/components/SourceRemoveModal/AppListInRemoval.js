import React from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';

import { Content, ContentVariants } from '@patternfly/react-core';

import { idToName } from './helpers';

const AppListInRemoval = ({ applications }) => {
  const { appTypes } = useSelector(({ sources }) => sources, shallowEqual);

  if (applications.length === 1) {
    return (
      <Content component="p" variant={ContentVariants.p}>
        {idToName(applications[0].application_type_id, appTypes)}
      </Content>
    );
  }

  return (
    <Content component="ul">
      {applications.map(({ id, application_type_id }) => (
        <Content component="li" key={id}>
          {idToName(application_type_id, appTypes)}
        </Content>
      ))}
    </Content>
  );
};

AppListInRemoval.propTypes = {
  applications: PropTypes.array,
};

export default AppListInRemoval;
