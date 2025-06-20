import {
  Badge,
  Bullseye,
  Card,
  CardBody,
  CardFooter,
  Content,
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
  Stack,
  StackItem,
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
import { IntegrationItem, createIntegrationsData } from './consts/widgetData';
import { useFlag } from '@unleash/proxy-client-react';
import PermissionsChecker from '../PermissionsChecker';

const IntegrationsWidget: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number[]>([]);
  const [integrationCounts, setIntegrationCounts] = useState<{ [key: string]: number }>({});

  const [selectedTileValue, setSelectedTileValue] = useState<string | null>(null);
  const [wizardCategory, setWizardCategory] = useState<string | null>(null);
  const [isIntegrationsWizardOpen, setIsIntegrationsWizardOpen] = useState(false);
  const [isSourcesWizardOpen, setIsSourcesWizardOpen] = useState(false);

  const hasSourcesPermissions = useSelector(({ user }) => user?.writePermissions);
  const hasIntegrationsPermissions = useSelector(({ user }) => user?.integrationsEndpointsPermissions);
  const isPagerDutyEnabled = useFlag('platform.integrations.pager-duty');
  const integrationsData = createIntegrationsData(isPagerDutyEnabled, hasSourcesPermissions, hasIntegrationsPermissions);

  const [dropdownOpenIndexes, setDropdownOpenIndexes] = useState<Record<number, boolean>>({});

  const handleTileClick = (id: string, value: string) => {
    const newSelectedId = selectedTileValue === id ? null : id;
    setSelectedTileValue(newSelectedId);
    setWizardCategory(value);

    if (newSelectedId !== null) {
      if ([REDHAT_VENDOR, CLOUD_VENDOR].includes(value)) {
        setIsSourcesWizardOpen(true);
      } else if ([COMMUNICATIONS, REPORTING, WEBHOOKS].includes(value)) {
        setIsIntegrationsWizardOpen(true);
      }
    }
  };

  const navigate = useNavigate();

  const handleDropdownAction = (action: string, value: string) => {
    if (action === 'create') {
      setWizardCategory(value);
      if ([REDHAT_VENDOR, CLOUD_VENDOR].includes(value)) {
        setIsSourcesWizardOpen(true);
      } else if ([COMMUNICATIONS, REPORTING, WEBHOOKS].includes(value)) {
        setIsIntegrationsWizardOpen(true);
      }
    } else if (action === 'view') {
      navigate(`/settings/integrations?category=${value}`);
    }
  };

  const allItems: IntegrationItem[] = integrationsData.flatMap((category) => category.items);
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

  const badgeCounts = (items: (typeof integrationsData)[0]['items']) => {
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

  const onToggle = (index: number, isExpandable: boolean) => {
    if (!isExpandable) {
      return;
    }

    setExpandedIndex((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  const onToggleDropdown = (index: number, isOpen: boolean) => {
    setDropdownOpenIndexes({ [index]: isOpen });
  };

  const store = useStore();

  const isEmptyState = Object.values(integrationCounts).reduce((total, count) => total + count, 0) === 0;

  return (
    <PermissionsChecker>
      {isLoading ? (
        <Bullseye>
          <Spinner />
        </Bullseye>
      ) : isEmptyState ? (
        <Stack className="integrations-widget-container pf-v6-u-p-lg">
          <StackItem>
            <div className="pf-v6-u-mb-md">
              <Content>
                Click on a third-party application to create an integration for it.{' '}
                <Link to="/settings/integrations?category=overview">Learn more about Integrations.</Link>
              </Content>
            </div>
          </StackItem>
          <StackItem>
            <Gallery hasGutter>
              {sortedItems.map((item) => (
                <Card
                  key={item.id}
                  id={item.id}
                  isSelectable
                  isSelected={selectedTileValue === item.id}
                  onClick={() => handleTileClick(item.id, item.value)}
                >
                  <CardBody className="pf-v6-u-text-align-center pf-v6-u-p-lg">
                    <div className="empty-state-icon">{item.icon}</div>
                    <div className="pf-v6-u-font-weight-bold">{item.name}</div>
                  </CardBody>
                </Card>
              ))}
            </Gallery>
          </StackItem>
        </Stack>
      ) : (
        <Card ouiaId="integrations-widget" isFullHeight isPlain>
          <CardBody className="pf-v6-u-pt-0">
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
                      <DataListItemRow className="pf-v6-u-pl-0 pf-v6-u-ml-lg">
                        {isExpandable ? (
                          <DataListToggle
                            onClick={() => onToggle(integrationIndex, isExpandable)}
                            isExpanded={expandedIndex.includes(integrationIndex)}
                            id={`toggle-${integrationIndex}`}
                            aria-controls={`expand-${integrationIndex}`}
                          />
                        ) : (
                          <div className="pf-v6-u-ml-lg" />
                        )}
                        <DataListItemCells
                          dataListCells={[
                            <DataListCell key="primary content">
                              <span className="pf-v6-u-pr-sm pf-v6-u-text-color-link pf-v6-u-font-weight-bold">
                                {integration.title}
                              </span>
                              <Badge isRead={badgeCounts(integration.items) === 0}>{badgeCounts(integration.items)}</Badge>
                            </DataListCell>,
                          ]}
                        />
                        <DataListAction aria-labelledby="actions" id="actions" aria-label="Actions">
                          <Dropdown
                            onSelect={() => onToggleDropdown(integrationIndex, false)}
                            toggle={(toggleRef) => (
                              <MenuToggle
                                onClick={() => onToggleDropdown(integrationIndex, !dropdownOpenIndexes[integrationIndex])}
                                id={`dropdown-toggle-${integrationIndex}`}
                                ref={toggleRef}
                                className="pf-v6-u-mr-0 pf-v6-u-my-xs"
                                size="sm"
                              >
                                Manage
                              </MenuToggle>
                            )}
                            isOpen={dropdownOpenIndexes[integrationIndex] || false}
                            popperProps={{ position: 'end', appendTo: 'inline', preventOverflow: true }}
                          >
                            <DropdownItem
                              key={`create-new-${integrationIndex}`}
                              onClick={() => {
                                handleDropdownAction('create', integration.value);
                              }}
                            >
                              Create new {integration.title} integration
                            </DropdownItem>

                            <DropdownItem
                              key={`view-all-${integrationIndex}`}
                              onClick={() => {
                                handleDropdownAction('view', integration.value);
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
                            {integration.items
                              .filter((item) => item.name !== 'Webhooks')
                              .map((item) => (
                                <Flex
                                  key={item.id}
                                  display={{ default: 'inlineFlex' }}
                                  className="pf-v6-u-p-sm pf-v6-u-pl-0 pf-v6-u-align-items-center"
                                >
                                  <Icon size="lg" iconSize="lg" className="pf-v6-u-mr-sm" isInline>
                                    {item.icon}
                                  </Icon>
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
          <CardFooter className="pf-v6-u-pt-md pf-v6-u-background-color-100">
            <IntegrationsDropdown />
          </CardFooter>
        </Card>
      )}
      {[COMMUNICATIONS, REPORTING, WEBHOOKS].includes(wizardCategory || '') && (
        <AsyncComponent
          scope="notifications"
          module="./IntegrationsWizard"
          store={store}
          isOpen={isIntegrationsWizardOpen}
          category={wizardCategory}
          closeModal={() => {
            setIsIntegrationsWizardOpen(false);
            setWizardCategory(null);
          }}
          fallback={<div id="fallback-modal" />}
        />
      )}
      {[REDHAT_VENDOR, CLOUD_VENDOR].includes(wizardCategory || '') && (
        <AddSourceWizard
          isOpen={isSourcesWizardOpen}
          onClose={() => {
            setIsSourcesWizardOpen(false);
            setWizardCategory(null);
          }}
          activeCategory={wizardCategory}
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
