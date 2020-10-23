import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';

import { TextList } from '@patternfly/react-core/dist/js/components/Text/TextList';
import { TextListItem } from '@patternfly/react-core/dist/js/components/Text/TextListItem';
import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';

import { idToName } from './helpers';

const AppListInRemoval = ({ applications }) => {
  const { appTypes } = useSelector(({ sources }) => sources, shallowEqual);

  if (applications.length === 1) {
    return <Text variant={TextVariants.p}>{idToName(applications[0].application_type_id, appTypes)}</Text>;
  }

  return (
    <TextList>
      {applications.map(({ id, application_type_id }) => (
        <TextListItem key={id}>{idToName(application_type_id, appTypes)}</TextListItem>
      ))}
    </TextList>
  );
};

AppListInRemoval.propTypes = {
  applications: PropTypes.array,
};

export default AppListInRemoval;
