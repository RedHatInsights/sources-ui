import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  ExpandableSection,
  Gallery,
  List,
  ListItem,
  ListVariant,
  Spinner,
  Tile,
} from '@patternfly/react-core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import IntegrationsDropdown from '../IntegrationsDropdown';
import { CLOUD_VENDOR, COMMUNICATIONS, REDHAT_VENDOR, REPORTING, WEBHOOKS } from '../../utilities/constants';
import { getProdStore } from '../../utilities/store';
import { AsyncComponent } from '@redhat-cloud-services/frontend-components';
import AddSourceWizard from '../addSourceWizard';
import './IntegrationsWidget.scss';
import { Link } from 'react-router-dom';
import { fetchCloudSources } from './services/fetchCloudSources';
import { fetchIntegrations } from './services/fetchIntegrations';
import { fetchRedHatSources } from './services/fetchRedHatSources';
import { createIntegrationsData } from './consts/widgetData';
import { useFlag } from '@unleash/proxy-client-react';
import PermissionsChecker from '../PermissionsChecker';

const IntegrationsWidget: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number[]>([]);
  const [integrationCounts, setIntegrationCounts] = useState<{ [key: string]: number }>({});

  const [selectedTileValue, setSelectedTileValue] = useState<string>('');
  const [isIntegrationsWizardOpen, setIsIntegrationsWizardOpen] = useState(false);
  const [isSourcesWizardOpen, setIsSourcesWizardOpen] = useState(false);

  const hasSourcesPermissions = useSelector(({ user }) => user?.writePermissions);
  const hasIntegrationsPermissions = useSelector(({ user }) => user?.integrationsEndpointsPermissions);
  const isPagerDutyEnabled = useFlag('platform.integrations.pager-duty');
  const integrationsData = createIntegrationsData(isPagerDutyEnabled, hasSourcesPermissions, hasIntegrationsPermissions);

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

  useEffect(() => {
    const loadAllSources = async () => {
      setIsLoading(true);
      
      const [cloudResult, redHatResult, integrationResult] = await Promise.all([
        fetchCloudSources(),
        fetchRedHatSources(),
        fetchIntegrations(),
      ]);

      setIntegrationCounts((prevCounts) => ({
        ...prevCounts,
        ...(cloudResult?.counts || {}),
        ...(redHatResult?.counts || {}),
        ...(integrationResult?.counts || {}),
      }));

      setIsLoading(false);
    };

    loadAllSources();
  }, []);

  const badgeCounts = (items: typeof integrationsData[0]['items']) => {
    return items.reduce((total, item) => total + (integrationCounts[item.id] || 0), 0);
  };

  useEffect(() => {
    if (!hasInitialized && Object.keys(integrationCounts).length > 0) {
      const initiallyExpandedIndex = integrationsData
        .map((integration, index) => (badgeCounts(integration.items) > 0 ? index : null))
        .filter((index) => index !== null) as number[];
      setExpandedIndex(initiallyExpandedIndex);
      setHasInitialized(true);
    }
  }, [integrationsData, integrationCounts, hasInitialized]);

  const onToggle = (index: number) => {
    setExpandedIndex((prevIndices) =>
      prevIndices.includes(index)
        ? prevIndices.filter(i => i !== index)
        : [...prevIndices, index]
    );
  };

  const isEmptyState = Object.values(integrationCounts).reduce((total, count) => total + count, 0) === 0;

  return (
    <PermissionsChecker>
      {isLoading ? (
        <Spinner />
      ) : isEmptyState ? (
        <>
          <Card isPlain ouiaId="integrations-widget-empty-state" isClickable>
            <CardBody>
              Click on a third-party application to create an integration for it.{' '}
              <Link to="/settings/integrations?category=overview">Learn more about Integrations.</Link>
            </CardBody>
            <CardBody>
              <Gallery hasGutter>
                {sortedItems.map((item) => (
                  <Tile
                    title={item.name}
                    id={item.id}
                    icon={item.icon}
                    isStacked
                    onClick={() => handleTileClick(item.value)}
                    isSelected={selectedTileValue === item.id}
                  />
                ))}
              </Gallery>
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
        <Card ouiaId="integrations-widget" isFullHeight>
          <CardBody>
            {integrationsData.map((integration, integrationIndex) => (
              <ExpandableSection
                key={integrationIndex}
                toggleContent={
                  <div>
                    <span>{integration.title} </span>
                    <Badge 
                    isRead={badgeCounts(integration.items) === 0}>
                      {badgeCounts(integration.items)}
                    </Badge>
                  </div>
                }
                onToggle={() => onToggle(integrationIndex)}
                isExpanded={expandedIndex.includes(integrationIndex)}              >
                <List variant={ListVariant.inline} className="pf-v5-u-mb-md">
                  {integration.items.map((item, itemIndex) => (
                    <ListItem key={itemIndex} icon={item.icon}>
                      {item.name} ( {integrationCounts[item.id] || 0} )
                    </ListItem>
                  ))}
                </List>
              </ExpandableSection>
            ))}
          </CardBody>
          <CardFooter>
            <IntegrationsDropdown />
          </CardFooter>
        </Card>
      )}{' '}
    </PermissionsChecker>
  );
};

const IntegrationsWidgetWrapper = () => (
  (<Provider store={getProdStore()}>
  <IntegrationsWidget />
</Provider>)
);

export default IntegrationsWidgetWrapper;
