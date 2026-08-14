import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Content,
  ContentVariants,
  DataListAction,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  Divider,
  Flex,
  FlexItem,
  Icon,
  Title,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { CLOUD_VENDOR, COMMUNICATIONS, REDHAT_VENDOR, REPORTING, WEBHOOKS } from '../../utilities/constants';
import { AsyncComponent } from '@redhat-cloud-services/frontend-components';
import AddSourceWizard from '../addSourceWizard';
import { useIntl } from 'react-intl';
import { useStore } from 'react-redux';

const CustomDataListItem = ({ initialExpanded, icon, title, actionTitle, action, content, learnMoreLink }) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isIntegrationsWizardOpen, setIsIntegrationsWizardOpen] = useState(false);
  const [isSourcesWizardOpen, setIsSourcesWizardOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const intl = useIntl();

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const store = useStore();

  return (
    <React.Fragment>
      <DataListItem aria-labelledby="item1" isExpanded={isExpanded} className={isExpanded && 'active-item'}>
        <DataListItemRow className="pf-v6-u-align-items-center">
          <DataListToggle isExpanded={isExpanded} id="toggle1" aria-controls="expand1" onClick={toggleExpand} />
          <DataListItemCells
            dataListCells={[
              <DataListCell key={`cell-${icon.toString().toLowerCase()}`}>
                <div>
                  <Flex className="pf-v6-u-flex-nowrap">
                    <FlexItem className="pf-v6-u-align-self-center">
                      <Icon size="lg" className="pf-v6-u-primary-color-100">
                        {icon}
                      </Icon>
                    </FlexItem>
                    <Divider
                      orientation={{
                        default: 'vertical',
                      }}
                    />
                    <FlexItem className="pf-v6-u-align-self-center">
                      <Title headingLevel="h4">{title}</Title>
                    </FlexItem>
                  </Flex>
                </div>
              </DataListCell>,
            ]}
          />
          {actionTitle && action && (
            <DataListAction aria-labelledby="item1 action1" id="action1" aria-label="Actions">
              <Button
                variant="link"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedIntegration(action);
                  if ([REDHAT_VENDOR, CLOUD_VENDOR].includes(action)) {
                    setIsSourcesWizardOpen(true);
                  } else if ([COMMUNICATIONS, REPORTING, WEBHOOKS].includes(action)) {
                    setIsIntegrationsWizardOpen(true);
                  }
                }}
              >
                {actionTitle}
              </Button>
            </DataListAction>
          )}
        </DataListItemRow>
        <DataListContent aria-label={`${title} - Detailed Explanation`} id="expand1" isHidden={!isExpanded}>
          <Content>
            <Content component={ContentVariants.p} className="pf-v6-u-mb-lg">
              {content}
            </Content>
          </Content>
          <Button
            isInline
            component="a"
            href={learnMoreLink}
            target="_blank"
            variant="link"
            icon={<ExternalLinkAltIcon />}
            iconPosition="end"
          >
            {intl.formatMessage({
              id: 'integrations.overview.dataListItemLearnMore',
              defaultMessage: 'Learn more',
            })}
          </Button>
        </DataListContent>
      </DataListItem>
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
    </React.Fragment>
  );
};

CustomDataListItem.propTypes = {
  initialExpanded: PropTypes.bool.isRequired,
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  actionTitle: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  learnMoreLink: PropTypes.string.isRequired,
};

export default CustomDataListItem;
