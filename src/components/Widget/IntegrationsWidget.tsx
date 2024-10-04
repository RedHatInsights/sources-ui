import { Badge, Card, CardBody, CardFooter, ExpandableSection, List, ListItem, ListVariant, Spinner, Tile} from '@patternfly/react-core';
import React, { FunctionComponent, useState } from 'react';
import { Provider } from 'react-redux';
import IntegrationsDropdown from '../IntegrationsDropdown';
import { CLOUD_VENDOR, COMMUNICATIONS, REDHAT_VENDOR, REPORTING, WEBHOOKS } from '../../utilities/constants';
import { getProdStore } from '../../utilities/store';
import ImageWithPlaceholder from '../TilesShared/ImageWithPlaceholder';
import { AsyncComponent } from '@redhat-cloud-services/frontend-components';
import AddSourceWizard from '../addSourceWizard';

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
        value: COMMUNICATIONS,
        icon: <ImageWithPlaceholder 
        className="google-chat-logo" 
        src="/apps/frontend-assets/sources-integrations/google-chat.svg" 
        alt="google chat" 
      />
      },
      { name: 'Microsoft Office Teams',
        id: '1',
        value: COMMUNICATIONS,
        icon: <ImageWithPlaceholder 
        className="microsoft-teams-logo" 
        src="/apps/frontend-assets/sources-integrations/microsoft-office-teams.svg" 
        alt="microsoft teams" 
      />
      },
      { name: 'Slack',
        id: '2',
        value: COMMUNICATIONS,
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
        value: REPORTING,
        icon: <ImageWithPlaceholder 
        className="ansible-logo" 
        src="/apps/frontend-assets/sources-integrations/ansible.svg" 
        alt="ansible" 
      />
      },
      { name: 'ServiceNow',
        id: '4',
        value: REPORTING,
        icon: <ImageWithPlaceholder 
        className="service-now-logo" 
        src="/apps/frontend-assets/sources-integrations/service-now.svg" 
        alt="service" 
      />
      },
      { name: 'Splunk',
        id: '5',
        value: REPORTING,
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
        value: WEBHOOKS,
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
        value: CLOUD_VENDOR,
        icon: <ImageWithPlaceholder
        className="aws-logo"
        src="/apps/frontend-assets/partners-icons/aws.svg"
        alt="aws logo"
      />
       },
      { name: 'Google Cloud',
        id: '8',
        value: CLOUD_VENDOR,
        icon: <ImageWithPlaceholder
        className="google-logo"
        src="/apps/frontend-assets/partners-icons/google-cloud-short.svg"
        alt="google logo"
      />
       },
      { name: 'Microsoft Azure',
        id: '9',
        value: CLOUD_VENDOR,
        icon: <ImageWithPlaceholder
        className="azure-logo"
        src="/apps/frontend-assets/partners-icons/microsoft-azure-short.svg"
        alt="azure logo"
      />
       },
      { name: 'Oracle Cloud Infrastructure',
        id: '10',
        value: CLOUD_VENDOR,
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
        value: REDHAT_VENDOR,
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
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
    const [integrations, setIntegrations] = useState<Integration[]>([]);

    const [selectedTileValue, setSelectedTileValue] = useState<string>('');
    const [isIntegrationsWizardOpen, setIsIntegrationsWizardOpen] = useState(false);
    const [isSourcesWizardOpen, setIsSourcesWizardOpen] = useState(false);

    const handleTileClick = (value: string) => {
      setSelectedTileValue(value);
      if ([REDHAT_VENDOR, CLOUD_VENDOR].includes(value)) {
        setIsSourcesWizardOpen(true);
      } else if ([COMMUNICATIONS, REPORTING, WEBHOOKS].includes(value)) {
        setIsIntegrationsWizardOpen(true);
      }
    };

    const allItems = integrationsData.flatMap((category) => category.items);
    const sortedItems = allItems.sort((a, b) => a.name.localeCompare(b.name));

    const onToggle = (index: number) => {
      setExpandedIndex(expandedIndex === index ? null : index);
    };

    // const fetchIntegrations = async () => {
    //   try {
    //     const response = await fetch(
    //       '/api/integrations/v1.0/endpoints?type=ansible&type=webhook&type=camel'
    //     );
    //     const { data } = await response.json();
    //     console.log(data);
    //     setIsLoading(false);
    //     setIntegrations(data)
    //   } catch (error) {
    //     console.error('Unable to get Integrations ', error);
    //   }
    // };
  
    // useEffect(() => {
    //   setIsLoading(true);
    //   fetchIntegrations();
    // }, []);

    const integrationCount = integrations.length

  return (
    <>
    {isLoading ? (
      <Spinner />
    ) :
    integrationsData.length === 5 ? (
      <>
      <Card isPlain ouiaId="integrations-widget-empty-state" isClickable>
          <CardBody>
          Click on a third-party application to create an integration for it. <a href="/settings/integrations?category=overview">Learn more about Integrations.</a>
         </CardBody>
          <CardBody>
          {sortedItems.map((item) => (
              <Tile 
              title={item.name} 
              id={item.id} 
              icon={item.icon}
              isStacked
              onClick={() => handleTileClick(item.value)}
              isSelected={selectedTileValue === item.value} />
            ))}
          </CardBody>
          {[COMMUNICATIONS, REPORTING, WEBHOOKS].includes(selectedTileValue) && (
        <AsyncComponent
          appName="notifications"
          module="./IntegrationsWizard"
          isOpen={isIntegrationsWizardOpen}
          category={selectedTileValue}
          closeModal={() => {
            setIsIntegrationsWizardOpen(false);
            setSelectedTileValue('');
          }}
          fallback={<div id="fallback-modal" />}
        />
      )}
      {[REDHAT_VENDOR, CLOUD_VENDOR].includes(selectedTileValue) && (
        <AddSourceWizard
          isOpen={isSourcesWizardOpen}
          onClose={() => {
            setIsSourcesWizardOpen(false);
            setSelectedTileValue('');
          }}
          activeCategory={selectedTileValue}
        />
      )}
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
      onToggle={() => onToggle(integrationIndex)}
      isExpanded={expandedIndex === integrationIndex}
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