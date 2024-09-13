import { Badge, Card, CardBody, CardFooter, ExpandableSection, Tile } from '@patternfly/react-core';
import { BellIcon } from '@patternfly/react-icons';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import CloudTiles from '../CloudTiles/CloudTiles';
import RedHatTiles from '../RedHatTiles/RedHatTiles';
import IntegrationsDropdown from '../IntegrationsDropdown';

export type Integration = {
    id: string;
    name: string;
    type: string;
    isEnabled: boolean;
    integrationCategory: string;
  };


const IntegrationsWidget = () => {
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const activeCategory = useSelector(({ sources }) => sources.activeCategory);


    const onToggle = (_event: React.MouseEvent, isExpanded: boolean) => {
      setIsExpanded(isExpanded);
    };


    const fetchIntegrations = async () => {
      try {
        const response = await fetch(
          '/api/integrations/v1.0'
        );
        const { data } = await response.json();
        setIntegrations(data);
      } catch (error) {
        console.error('Unable to get Integrations ', error);
      }
    };
  
    useEffect(() => {
      fetchIntegrations();
    }, []);

  return (
    <>
    {integrations.length === 0 ? (
      <>
      <Card isPlain ouiaId="integrations-widget-empty-state">
          <CardBody>Click on a third-party application to create an integration for it. <a href="/settings/integrations?category=overview">Learn more about Integrations.</a></CardBody>
           <CloudTiles />
           <RedHatTiles />
          </Card>
          </>
     ) : (
      <Card>
<ExpandableSection
      toggleContent={
        <div>
          <span>{activeCategory}</span>
          <Badge isRead>{integrations.length}</Badge>
        </div>
      }
      onToggle={onToggle}
      isExpanded={isExpanded}
    >
    </ExpandableSection>
    <CardFooter>
      <IntegrationsDropdown />
      </CardFooter>
    </Card>
     )} </> 
  );
};

export default IntegrationsWidget;
