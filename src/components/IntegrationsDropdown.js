import React, { useState } from 'react';
import { Dropdown, DropdownItem, DropdownList, MenuToggle } from '@patternfly/react-core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import AddSourceWizard from './addSourceWizard';
import { CLOUD_VENDOR, COMMUNICATIONS, REDHAT_VENDOR, REPORTING, WEBHOOKS } from '../utilities/constants';
import { checkPropTypes } from 'prop-types';
import { useFlag } from '@unleash/proxy-client-react';
import { useSelector, useStore } from 'react-redux';

import PlusCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/plus-circle-icon';

const dropdownItems = (isPagerDutyEnabled, hasSourcesPermissions, hasIntegrationsPermissions) => [
  ...(hasSourcesPermissions
    ? [
        {
          title: 'Cloud',
          description: 'Amazon Web Services, Google Cloud Platform, Microsoft Azure',
          value: CLOUD_VENDOR,
        },
        {
          title: 'Red Hat',
          description: 'Red Hat OpenShift Container Platform, Red Hat Satellite, Red Hat Ansible Automation Platform',
          value: REDHAT_VENDOR,
        },
      ]
    : []),
  ...(hasIntegrationsPermissions
    ? [
        {
          title: 'Communications',
          description: 'Google Chat, Microsoft Office Teams, Slack, Email',
          value: COMMUNICATIONS,
        },
        {
          title: 'Reporting & automation',
          description: `Event-Driven Ansible, ${isPagerDutyEnabled ? 'PagerDuty, ' : ''}ServiceNow, Splunk`,
          value: REPORTING,
        },
        {
          title: 'Webhooks',
          description: '',
          value: WEBHOOKS,
        },
      ]
    : []),
];

const IntegrationsDropdown = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isIntegrationsWizardOpen, setIsIntegrationsWizardOpen] = useState(false);
  const [isSourcesWizardOpen, setIsSourcesWizardOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const isPagerDutyEnabled = useFlag('platform.integrations.pager-duty');
  const hasSourcesPermissions = useSelector(({ user }) => user?.writePermissions);
  const hasIntegrationsPermissions = useSelector(({ user }) => user?.integrationsEndpointsPermissions);

  const handleSelect = (_event, value) => {
    setIsOpen(false);
    setSelectedIntegration(value);
    if ([REDHAT_VENDOR, CLOUD_VENDOR].includes(value)) {
      setIsSourcesWizardOpen(true);
    } else if ([COMMUNICATIONS, REPORTING, WEBHOOKS].includes(value)) {
      setIsIntegrationsWizardOpen(true);
    }
  };

  const store = useStore();

  return (
    <div className="integrations-dropdown">
      {[REDHAT_VENDOR, CLOUD_VENDOR].includes(selectedIntegration) && (
        <AddSourceWizard
          isOpen={isSourcesWizardOpen}
          onClose={() => {
            setIsSourcesWizardOpen(false);
            setSelectedIntegration(null);
          }}
          activeCategory={selectedIntegration}
        />
      )}
      {[COMMUNICATIONS, REPORTING, WEBHOOKS].includes(selectedIntegration) && (
        <AsyncComponent
          scope="notifications"
          module="./IntegrationsWizard"
          store={store}
          isOpen={isIntegrationsWizardOpen}
          category={selectedIntegration}
          closeModal={() => {
            setIsIntegrationsWizardOpen(false);
            setSelectedIntegration(null);
          }}
          fallback={<div id="fallback-modal" />}
        />
      )}
      <Dropdown
        isOpen={isOpen}
        onSelect={handleSelect}
        onOpenChange={setIsOpen}
        popperProps={{
          appendTo: () => document.body,
          position: 'top',
        }}
        toggle={(toggleRef) => (
          <MenuToggle
            ref={toggleRef}
            onClick={() => setIsOpen(!isOpen)}
            isExpanded={isOpen}
            isDisabled={props.isDisabled || (!hasSourcesPermissions && !hasIntegrationsPermissions)}
            variant="secondary"
            className="pf-v6-u-pl-md"
            icon={<PlusCircleIcon />}
          >
            Create Integration
          </MenuToggle>
        )}
        {...props}
      >
        <DropdownList>
          {dropdownItems(isPagerDutyEnabled, hasSourcesPermissions, hasIntegrationsPermissions).map(
            ({ title, value, description }) => (
              <DropdownItem key={title} value={value} description={description}>
                {title}
              </DropdownItem>
            ),
          )}
        </DropdownList>
      </Dropdown>
    </div>
  );
};

IntegrationsDropdown.propTypes = {
  isDisabled: checkPropTypes.bool,
};

export default IntegrationsDropdown;
