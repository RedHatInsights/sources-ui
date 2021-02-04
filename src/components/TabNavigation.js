import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { Tabs } from '@patternfly/react-core/dist/esm/components/Tabs/Tabs';
import { Tab } from '@patternfly/react-core/dist/esm/components/Tabs/Tab';
import { TabTitleIcon } from '@patternfly/react-core/dist/esm/components/Tabs/TabTitleIcon';
import { TabTitleText } from '@patternfly/react-core/dist/esm/components/Tabs/TabTitleText';
import RedhatIcon from '@patternfly/react-icons/dist/esm/icons/redhat-icon';
import CloudIcon from '@patternfly/react-icons/dist/esm/icons/cloud-icon';

import { setActiveVendor } from '../redux/sources/actions';
import { CLOUD_VENDOR, REDHAT_VENDOR } from '../utilities/constants';

const TabNavigation = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const activeVendor = useSelector(({ sources }) => sources.activeVendor);

  return (
    <Tabs activeKey={activeVendor} onSelect={(_e, key) => dispatch(setActiveVendor(key))} className="pf-u-mt-md">
      <Tab
        eventKey={CLOUD_VENDOR}
        title={
          <React.Fragment>
            <TabTitleIcon>
              <CloudIcon />
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
              <RedhatIcon />
            </TabTitleIcon>
            <TabTitleText>{intl.formatMessage({ id: 'sources.redhatSources', defaultMessage: 'Red Hat sources' })}</TabTitleText>
          </React.Fragment>
        }
      />
    </Tabs>
  );
};

export default TabNavigation;
