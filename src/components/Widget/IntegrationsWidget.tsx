import {
  Badge,
  Bullseye,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  DataList,
  DataListAction,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  Dropdown,
  DropdownItem,
  Flex,
  Gallery,
  Icon,
  MenuToggle,
  Spinner,
} from '@patternfly/react-core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Provider, useSelector, useStore } from 'react-redux';
import IntegrationsDropdown from '../IntegrationsDropdown';
import { CLOUD_VENDOR, COMMUNICATIONS, REDHAT_VENDOR, REPORTING, WEBHOOKS } from '../../utilities/constants';
import { getProdStore } from '../../utilities/store';
import { AsyncComponent } from '@redhat-cloud-services/frontend-components';
import AddSourceWizard from '../addSourceWizard';
import './IntegrationsWidget.scss';
import { Link, useNavigate } from 'react-router-dom';
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

  const [dropdownOpenIndexes, setDropdownOpenIndexes] = useState<Record<number, boolean>>({});

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
        .map((integration, index) =>
          badgeCounts(integration.items) > 0 ? index : null
        )
        .filter((index) => index !== null) as number[];
      setExpandedIndex(initiallyExpandedIndex);
      setHasInitialized(true);
    }
  }, [integrationsData, integrationCounts, hasInitialized]);

  const onToggle = (index: number, isExpandable: boolean) => {
    if (!isExpandable) return; // Prevent toggling if it's not expandable
    setExpandedIndex((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const onToggleDropdown = (index: number, isOpen: boolean) => {
    setDropdownOpenIndexes({ [index]: isOpen });
  };

  const store = useStore();

  const isEmptyState = Object.values(integrationCounts).reduce((total, count) => total + count, 0) === 0;

  const navigate = useNavigate();

  const handleDropdownAction = (action: string, integrationTitle: string) => {
    if (action === 'create') {
      if ([REDHAT_VENDOR, CLOUD_VENDOR].includes(integrationTitle)) {
        setSelectedTileValue(integrationTitle);
        setIsSourcesWizardOpen(true);
      } else if ([COMMUNICATIONS, REPORTING, WEBHOOKS].includes(integrationTitle)) {
        setSelectedTileValue(integrationTitle);
        setIsIntegrationsWizardOpen(true);
      }
    } else if (action === 'view') {
      navigate(`/settings/integrations?category=${integrationTitle}`);
    }
  };

  return (
    <PermissionsChecker>
      {isLoading ? (
        <Bullseye>
          <Spinner />
        </Bullseye>
      ) : isEmptyState ? (
        <Card ouiaId="integrations-widget-empty-state">
  <CardBody className='pf-v6-u-ml-sm'>
    Click on a third-party application to create an integration for it.{' '}
    <Link to="/settings/integrations?category=overview">Learn more about Integrations.</Link>
  </CardBody>
  <CardBody>
    <Gallery hasGutter>
      {sortedItems.map((item) => (
        <Card
          key={item.id}
          isSelectable
          isSelected={selectedTileValue === item.id}
          onClick={() => handleTileClick(item.value)}
          id={item.id}
          className='pf-v6-u-m-sm'
          isCompact
        >
          <CardHeader
          selectableActions={{
            selectableActionId: item.id,
            name: item.id,
            variant: 'single',
          }}
        ></CardHeader>
          <CardBody className="pf-v5-u-text-align-center pf-v5-u-p-lg">
  <Icon size="lg" className="pf-v5-u-mb-md">{item.icon}</Icon>
  <div className="pf-v5-u-font-weight-bold">{item.name}</div>
</CardBody>
        </Card>
      ))}
    </Gallery>
  </CardBody>
</Card>
      ) : (
        <Card ouiaId="integrations-widget" isFullHeight>
          <CardBody className="pf-v5-u-pt-0">
            <DataList aria-label="Integrations List" isCompact>
              {integrationsData.map((integration, integrationIndex) => {
                const isExpandable = integration.title !== 'Webhooks';
                return (
                  <React.Fragment key={`integration-fragment-${integrationIndex}`}>
                    <DataListItem
                      key={integrationIndex}
                      aria-labelledby={`integration-${integrationIndex}`}
                      isExpanded={isExpandable ? expandedIndex.includes(integrationIndex) : false}
                    >
                      <DataListItemRow className="pf-v5-u-pl-0 pf-v5-u-ml-lg">
                        {isExpandable ? (
                          <DataListToggle
                            onClick={() => onToggle(integrationIndex, isExpandable)}
                            isExpanded={expandedIndex.includes(integrationIndex)}
                            id={`toggle-${integrationIndex}`}
                            aria-controls={`expand-${integrationIndex}`}
                          />
                        ) : (
                          <div className="pf-v5-u-ml-lg" />
                        )}
                        <DataListItemCells
                          dataListCells={[
                            <DataListCell key="primary content">
                              <span className="pf-v5-u-pr-sm pf-v6-u-text-color-link pf-v6-u-font-weight-bold">{integration.title}</span>
                              <Badge isRead={badgeCounts(integration.items) === 0}>
                                {badgeCounts(integration.items)}
                              </Badge>
                            </DataListCell>
                          ]}
                        />
                        <DataListAction aria-labelledby="actions" id="actions" aria-label="Actions">
                          <Dropdown
                            onSelect={() => onToggleDropdown(integrationIndex, false)}
                            toggle={(toggleRef) => (
                              <MenuToggle
                                onClick={() =>
                                  onToggleDropdown(integrationIndex, !dropdownOpenIndexes[integrationIndex])
                                }
                                id={`dropdown-toggle-${integrationIndex}`}
                                ref={toggleRef}
                                className="pf-v5-u-mr-0"
                              >
                                Manage
                              </MenuToggle>
                            )}
                            isOpen={dropdownOpenIndexes[integrationIndex] || false}
                            popperProps={{ position: "end", appendTo: 'inline', preventOverflow: true}}                          >
                            <DropdownItem
                              key={`create-new-${integrationIndex}`}
                              onClick={() => {
                                handleDropdownAction('create', integration.title)}}
                              isSelected={selectedTileValue === integration.title}
                            >
                              Create new {integration.title} integration
                            </DropdownItem>

                            <DropdownItem
                              key={`view-all-${integrationIndex}`}
                              onClick={() => {
                                handleDropdownAction('view', integration.title);
                            }} 
                            >
                              View all {integration.title} Integrations
                            </DropdownItem>
                          </Dropdown>
                        </DataListAction>
                      </DataListItemRow>
                      <DataListContent aria-label="widget-content" id={`expand-${integrationIndex}`}>
                        {expandedIndex.includes(integrationIndex) && (
                          <div>
                            {integration.items.filter((item) => item.name !== 'Webhooks').map((item, itemIndex) => (
                              <Flex display={{ default: 'inlineFlex' }} className="pf-v5-u-p-sm pf-v5-u-pt-0 pf-v6-u-align-items-center">
                                <Icon size="md" iconSize="lg" className="pf-v5-u-mr-sm" isInline>{item.icon}</Icon>
                                {item.name} ({integrationCounts[item.id] || 0})
                              </Flex>
                            ))}
                          </div>
                        )}
                      </DataListContent>
                    </DataListItem>
                  </React.Fragment>
                );
              })}
            </DataList>
          </CardBody>
          <CardFooter className="pf-v5-u-pt-md pf-v5-u-background-color-100">
            <IntegrationsDropdown />
          </CardFooter>
        </Card>
      )}
        {[COMMUNICATIONS, REPORTING, WEBHOOKS].includes(selectedTileValue) && (
              <AsyncComponent
                scope="notifications"
                module="./IntegrationsWizard"
                store={store}
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
    </PermissionsChecker>
  );
};

const IntegrationsWidgetWrapper = () => (
  <Provider store={getProdStore()}>
    <IntegrationsWidget />
  </Provider>
);

export default IntegrationsWidgetWrapper;