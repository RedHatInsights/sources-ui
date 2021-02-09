import React from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Card } from '@patternfly/react-core/dist/esm/components/Card/Card';
import { CardBody } from '@patternfly/react-core/dist/esm/components/Card/CardBody';
import { CardTitle } from '@patternfly/react-core/dist/esm/components/Card/CardTitle';
import { DescriptionList } from '@patternfly/react-core/dist/esm/components/DescriptionList/DescriptionList';
import { DescriptionListGroup } from '@patternfly/react-core/dist/esm/components/DescriptionList/DescriptionListGroup';
import { DescriptionListTerm } from '@patternfly/react-core/dist/esm/components/DescriptionList/DescriptionListTerm';
import { DescriptionListDescription } from '@patternfly/react-core/dist/esm/components/DescriptionList/DescriptionListDescription';

import { useSource } from '../../hooks/useSource';
import { configurationModeFormatter, dateFormatter, sourceTypeFormatter } from '../../views/formatters';
import AvailabilityChecker from './AvailabilityChecker';

const DescriptionListItem = ({ term, description }) => (
  <DescriptionListGroup>
    <DescriptionListTerm>{term}</DescriptionListTerm>
    <DescriptionListDescription>{description}</DescriptionListDescription>
  </DescriptionListGroup>
);

DescriptionListItem.propTypes = {
  term: PropTypes.node,
  description: PropTypes.node,
};

const SourceSummaryCard = () => {
  const intl = useIntl();
  const source = { ...useSource(), app_creation_workflow: 'trust' };
  const sourceTypes = useSelector(({ sources }) => sources.sourceTypes, shallowEqual);

  return (
    <Card className="pf-m-selectable pf-m-selected card summary-card pf-u-m-lg pf-u-mr-sm-on-md">
      <CardTitle>
        {intl.formatMessage({
          id: 'detail.summary.title',
          defaultMessage: 'Source summary',
        })}
      </CardTitle>
      <CardBody>
        <DescriptionList
          columnModifier={{
            default: '2Col',
          }}
        >
          <DescriptionListItem
            term={intl.formatMessage({
              id: 'detail.summary.type',
              defaultMessage: 'Source type',
            })}
            description={sourceTypeFormatter(source.source_type_id, undefined, { sourceTypes })}
          />
          <DescriptionListItem
            term={intl.formatMessage({
              id: 'detail.summary.lastChecked',
              defaultMessage: 'Last availability check',
            })}
            description={
              <React.Fragment>
                {source.last_checked_at || source.last_available_at
                  ? dateFormatter(source.last_checked_at || source.last_available_at)
                  : intl.formatMessage({
                      id: 'detail.summary.notChecked',
                      defaultMessage: 'Not checked yet',
                    })}
                <AvailabilityChecker />
              </React.Fragment>
            }
          />
          <DescriptionListItem
            term={intl.formatMessage({
              id: 'detail.summary.dateAdded',
              defaultMessage: 'Date added',
            })}
            description={dateFormatter(source.created_at)}
          />
          <DescriptionListItem
            term={intl.formatMessage({
              id: 'detail.summary.lastModified',
              defaultMessage: 'Last modified',
            })}
            description={dateFormatter(source.updated_at)}
          />
          {source.app_creation_workflow && (
            <DescriptionListItem
              term={intl.formatMessage({
                id: 'detail.summary.configurationMode',
                defaultMessage: 'Configuration mode',
              })}
              description={configurationModeFormatter(source.app_creation_workflow, source, { intl })}
            />
          )}
        </DescriptionList>
      </CardBody>
    </Card>
  );
};

export default SourceSummaryCard;
