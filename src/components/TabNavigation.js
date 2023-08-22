import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { Tab, TabTitleIcon, TabTitleText, Tabs } from '@patternfly/react-core';
import RedhatIcon from '@patternfly/react-icons/dist/esm/icons/redhat-icon';
import CloudIcon from '@patternfly/react-icons/dist/esm/icons/cloud-icon';

import { setActiveCategory } from '../redux/sources/actions';
import { CLOUD_VENDOR, REDHAT_VENDOR } from '../utilities/constants';

const TabNavigation = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const activeCategory = useSelector(({ sources }) => sources.activeCategory);

  return (
    <Tabs activeKey={activeCategory} onSelect={(_e, key) => dispatch(setActiveCategory(key))} className="pf-v5-u-mt-md">
      <Tab
        eventKey={CLOUD_VENDOR}
        title={
          <React.Fragment>
            <TabTitleIcon>
              <CloudIcon aria-label="Cloud Icon" />
            </TabTitleIcon>
            <TabTitleText>{intl.formatMessage({ id: 'sources.cloudSources', defaultMessage: 'Cloud sources' })}</TabTitleText>
          </React.Fragment>
        }
      />
      <Tab
        eventKey={REDHAT_VENDOR}
        title={
          <React.Fragment>
            <TabTitleIcon>
              <RedhatIcon aria-label="Red Hat Icon" />
            </TabTitleIcon>
            <TabTitleText>{intl.formatMessage({ id: 'sources.redhatSources', defaultMessage: 'Red Hat sources' })}</TabTitleText>
          </React.Fragment>
        }
      />
    </Tabs>
  );
};

export default TabNavigation;
