import { Badge, Card, CardBody, CardFooter, ExpandableSection, List, ListItem, ListVariant, Spinner, Split, SplitItem } from '@patternfly/react-core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import IntegrationsDropdown from '../IntegrationsDropdown';
import { CLOUD_VENDOR, COMMUNICATIONS, REDHAT_VENDOR, REPORTING, WEBHOOKS } from '../../utilities/constants';
import { getProdStore } from '../../utilities/store';
import ImageWithPlaceholder from '../TilesShared/ImageWithPlaceholder';

interface IntegrationItem {
  name: string;
  icon: React.ReactNode;
}

interface Integration {
  title: string;
  items: IntegrationItem[];
}

const integrationsData = [
  {
    title: COMMUNICATIONS,
    items: [
      { name: 'Google Chat',
        id: '0',
        icon: <ImageWithPlaceholder 
        className="google-chat-logo" 
        src="/apps/frontend-assets/sources-integrations/google-chat.svg" 
        alt="google chat" 
      />
      },
      { name: 'Microsoft Office Teams',
        id: '1',
        icon: <ImageWithPlaceholder 
        className="microsoft-teams-logo" 
        src="/apps/frontend-assets/sources-integrations/microsoft-office-teams.svg" 
        alt="microsoft teams" 
      />
      },
      { name: 'Slack',
        id: '2',
        icon: <ImageWithPlaceholder 
        className="slack-logo" 
        src="/apps/frontend-assets/sources-integrations/slack.svg" 
        alt="slack" 
      />
      }
    ]
  },
  {
    title: REPORTING,
    items: [
      { name: 'Event-Driven Ansible',
        id: '3',
        icon: <ImageWithPlaceholder 
        className="ansible-logo" 
        src="/apps/frontend-assets/sources-integrations/ansible.svg" 
        alt="ansible" 
      />
      },
      { name: 'ServiceNow',
        id: '4',
        icon: <ImageWithPlaceholder 
        className="service-now-logo" 
        src="/apps/frontend-assets/sources-integrations/service-now.svg" 
        alt="service" 
      />
      },
      { name: 'Splunk',
        id: '5',
        icon: <ImageWithPlaceholder 
        className="splunk-logo" 
        src="/apps/frontend-assets/sources-integrations/splunk.svg" 
        alt="splunk" 
      />
      }
    ]
  },
  {
    title: WEBHOOKS,
    items: [
      { name: 'Webhooks',
        id: '6',
        icon: <ImageWithPlaceholder 
        className="webhook-logo" 
        src="/apps/frontend-assets/integrations-landing/integrations-landing-webhook-icon.svg" 
        alt="webhooks" 
      />
    }
  ]
  },
  {
    title: CLOUD_VENDOR,
    items: [
      { name: 'Amazon Web Services',
        id: '7',
        icon: <ImageWithPlaceholder
        className="aws-logo"
        src="/apps/frontend-assets/partners-icons/aws.svg"
        alt="aws logo"
      />
       },
      { name: 'Google Cloud',
        id: '8',
        icon: <ImageWithPlaceholder
        className="google-logo"
        src="/apps/frontend-assets/partners-icons/google-cloud-short.svg"
        alt="google logo"
      />
       },
      { name: 'Microsoft Azure',
        id: '9',
        icon: <ImageWithPlaceholder
        className="azure-logo"
        src="/apps/frontend-assets/partners-icons/microsoft-azure-short.svg"
        alt="azure logo"
      />
       },
      { name: 'Oracle Cloud Infrastructure',
        id: '10',
        icon: <ImageWithPlaceholder
        className="oracle-logo"
        src="/apps/frontend-assets/partners-icons/oracle-short.svg"
        alt="oracle logo"
      />
      }
    ]
  },
  {
    title: REDHAT_VENDOR,
    items: [
      { name: 'OpenShift Container Platform',
        id: '11',
        icon: <ImageWithPlaceholder 
        className="redhat-icon" 
        src="/apps/frontend-assets/red-hat-logos/stacked.svg" 
        alt="red hat logo" 
      />
      }
    ]
  }
];

const IntegrationsWidget: FunctionComponent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState<number | null>(null);
    const [integrations, setIntegrations] = useState<Integration[]>([]);

    const onToggle = (index: number, isExpanded: boolean) => {
      setIsExpanded(isExpanded ? null : index);
    };

    const fetchIntegrations = async () => {
      try {
        const response = await fetch(
          '/api/integrations/v1.0/endpoints?type=ansible&type=webhook&type=camel'
        );
        const { data } = await response.json();
        console.log(data);
        setIsLoading(false);
        setIntegrations(data)
      } catch (error) {
        console.error('Unable to get Integrations ', error);
      }
    };
  
    useEffect(() => {
      setIsLoading(true);
      fetchIntegrations();
    }, []);

    const integrationCount = integrationsData.length
    console.log(integrationCount);

  return (
    <>
    {isLoading ? (
      <Spinner />
    ) :
    integrationsData.length === 0 ? (
      <>
      <Card isPlain ouiaId="integrations-widget-empty-state">
          <CardBody>Click on a third-party application to create an integration for it. <a href="/settings/integrations?category=overview">Learn more about Integrations.</a>
          </CardBody>
          </Card>
          </>
     ) : (
      <Card ouiaId='integrations-widget' isFullHeight>
        <CardBody>
        {integrationsData.map((integration, integrationIndex) => 
<ExpandableSection
key={integrationIndex}
      toggleContent={
          <div>
            <span>{integration.title} </span>
            <Badge isRead>{integrationCount}</Badge>
          </div>
      }
      onToggle={(event, isExpanded) => onToggle(integrationIndex, isExpanded)}
      isExpanded={isExpanded === integrationIndex}
    >
        {integration.items.map((item, itemIndex) => (
          <List variant={ListVariant.inline} key={itemIndex} className='pf-v5-u-mb-md'>
            <ListItem icon={item.icon}>
              {item.name} ()
            </ListItem>
         </List>
        ))}
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