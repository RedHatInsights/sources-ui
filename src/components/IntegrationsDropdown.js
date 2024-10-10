import React, { useState } from 'react';
import { Dropdown, DropdownItem, DropdownList, MenuToggle } from '@patternfly/react-core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import AddSourceWizard from './addSourceWizard';
import { CLOUD_VENDOR, COMMUNICATIONS, REDHAT_VENDOR, REPORTING, WEBHOOKS } from '../utilities/constants';
import { checkPropTypes } from 'prop-types';

const dropdownItems = [
  {
    title: 'Cloud',
    description: 'Amazon Web Services, Google Cloud Platform, Microsoft Azure, Oracle Cloud Platform',
    value: CLOUD_VENDOR,
  },
  {
    title: 'Red Hat',
    description: 'Red Hat OpenShift Container Platform, Red Hat Satellite, Red Hat Ansible Automation Platform',
    value: REDHAT_VENDOR,
  },
  {
    title: 'Communications',
    description: 'Google Chat, Microsoft Office Teams, Slack',
    value: COMMUNICATIONS,
  },
  {
    title: 'Reporting & Automation',
    description: 'Event-Driven Ansible, ServiceNow, Splunk',
    value: REPORTING,
  },
  {
    title: 'Webhooks',
    description: '',
    value: WEBHOOKS,
  },
];

const IntegrationsDropdown = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isIntegrationsWizardOpen, setIsIntegrationsWizardOpen] = useState(false);
  const [isSourcesWizardOpen, setIsSourcesWizardOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const handleSelect = (_event, value) => {
    setIsOpen(false);
    setSelectedIntegration(value);
    if ([REDHAT_VENDOR, CLOUD_VENDOR].includes(value)) {
      setIsSourcesWizardOpen(true);
    } else if ([COMMUNICATIONS, REPORTING, WEBHOOKS].includes(value)) {
      setIsIntegrationsWizardOpen(true);
    }
  };

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
          appName="notifications"
          module="./IntegrationsWizard"
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
        toggle={(toggleRef) => (
          <MenuToggle
            ref={toggleRef}
            onClick={() => setIsOpen(!isOpen)}
            isExpanded={isOpen}
            isDisabled={props.isDisabled}
            variant="primary"
          >
            Create Integration
          </MenuToggle>
        )}
        {...props}
      >
        <DropdownList>
          {dropdownItems.map(({ title, value, description }) => (
            <DropdownItem key={title} value={value} description={description}>
              {title}
            </DropdownItem>
          ))}
        </DropdownList>
      </Dropdown>
    </div>
  );
};

IntegrationsDropdown.propTypes = {
  isDisabled: checkPropTypes.bool,
};

export default IntegrationsDropdown;
