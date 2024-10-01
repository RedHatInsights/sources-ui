import { Badge, Card, CardBody, CardFooter, Divider, ExpandableSection, List, ListItem, ListVariant, Spinner, Tile } from '@patternfly/react-core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import IntegrationsDropdown from '../IntegrationsDropdown';
import { CLOUD_VENDOR, COMMUNICATIONS, REDHAT_VENDOR, REPORTING, WEBHOOKS } from '../../utilities/constants';
import { getProdStore } from '../../utilities/store';
import { PlusIcon } from '@patternfly/react-icons';

export type Integration = {
    id: string;
    name: string;
    type: string;
    isEnabled: boolean;
  };

  export enum IntegrationType {
    WEBHOOK = 'webhook',
    SPLUNK = 'camel:splunk',
    SLACK = 'camel:slack',
    SERVICE_NOW = 'camel:servicenow',
    TEAMS = 'camel:teams',
    GOOGLE_CHAT = 'Google Chat',
    ANSIBLE = 'ansible', // Event-Driven Ansible
  }
  
  export const UserIntegrationType = {
    WEBHOOK: IntegrationType.WEBHOOK,
    ANSIBLE: IntegrationType.ANSIBLE,
    SPLUNK: IntegrationType.SPLUNK,
    SERVICE_NOW: IntegrationType.SERVICE_NOW,
    SLACK: IntegrationType.SLACK,
    TEAMS: IntegrationType.TEAMS,
    GOOGLE_CHAT: IntegrationType.GOOGLE_CHAT,
  } as const;

  export enum IntegrationCategory {
    COMMUNICATIONS = 'Communications',
    REPORTING = 'Reporting',
    WEBHOOKS = 'Webhooks',
  }

  interface IntegrationsWidgetProps {
    category?: IntegrationCategory;
  }

const categoryNames = [
  {
    categoryName: COMMUNICATIONS,
    googleChat: 'Google Chat',
    microSoft: 'Microsoft office Teams',
    slack: 'Slack'
  },
  {
    categoryName: REPORTING,
    ansible: 'Event-Driven Ansible',
    serviceNow: 'ServiceNow',
    splunk: 'Splunk'

  },
  {
    categoryName: WEBHOOKS,
  },
  {categoryName: CLOUD_VENDOR},
  {categoryName: REDHAT_VENDOR},
];

const IntegrationsWidget: FunctionComponent<IntegrationsWidgetProps> = ({ category }) => {
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onToggle = (_event: React.MouseEvent, isExpanded: boolean) => {
      setIsExpanded(isExpanded);
    };

    const fetchIntegrations = async () => {
      try {
        const response = await fetch(
          '/api/integrations/v1.0/endpoints?type=ansible&type=webhook&type=camel'
        );
        const { data } = await response.json();
        console.log(data);
        setIntegrations(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Unable to get Integrations ', error);
      }
    };
  
    useEffect(() => {
      setIsLoading(true);
      fetchIntegrations();
    }, []);

  return (
    <>
    {isLoading ? (
      <Spinner />
    ) :
    integrations.length === 0 ? (
      <>
      <Card isPlain ouiaId="integrations-widget-empty-state">
          <CardBody>Click on a third-party application to create an integration for it. <a href="/settings/integrations?category=overview">Learn more about Integrations.</a>
          </CardBody>
          </Card>
          </>
     ) : (
      <Card>
        <CardBody>
        {...categoryNames.map((cat) => 
<ExpandableSection
      toggleContent={
          <div>
            <>
            <span>{cat.categoryName} </span>
            <Badge isRead>{integrations.length}</Badge>
            </>
          </div>
      }
      onToggle={onToggle}
      isExpanded={isExpanded}
    >
      {cat.categoryName === COMMUNICATIONS && 
      <div role="listbox" aria-label="Tiles with icon">
       <List variant={ListVariant.inline}>
    <ListItem>{cat.googleChat}</ListItem>
    <ListItem>{cat.microSoft}</ListItem>
    <ListItem>{cat.slack}</ListItem>
  </List>
    </div>    
    }
     {cat.categoryName === REPORTING && 
      <div role="listbox" aria-label="Tiles with icon">
       <List variant={ListVariant.inline}>
    <ListItem>{cat.ansible} ({integrations.length})</ListItem>
    <ListItem>{cat.serviceNow}</ListItem>
    <ListItem>{cat.splunk}</ListItem>
  </List>
    </div>    
    }
      {cat.categoryName === WEBHOOKS && 
      <div role="listbox" aria-label="Tiles with icon">
       <List variant={ListVariant.inline}>
    <ListItem>{WEBHOOKS}</ListItem>
  </List>
    </div>    
    }
    </ExpandableSection>
  )}
    </CardBody>
    <CardFooter>
      <IntegrationsDropdown />
    </CardFooter>
    </Card>
     )} </> 
  );
};

const IntegrationsWidgetWrapper = () => <Provider store={getProdStore()}>
  <IntegrationsWidget />
</Provider>

export default IntegrationsWidgetWrapper;