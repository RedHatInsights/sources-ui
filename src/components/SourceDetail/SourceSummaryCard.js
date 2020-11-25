import React from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';

import { Card } from '@patternfly/react-core/dist/js/components/Card/Card';
import { CardBody } from '@patternfly/react-core/dist/js/components/Card/CardBody';
import { CardTitle } from '@patternfly/react-core/dist/js/components/Card/CardTitle';
import { DescriptionList } from '@patternfly/react-core/dist/js/components/DescriptionList/DescriptionList';
import { DescriptionListGroup } from '@patternfly/react-core/dist/js/components/DescriptionList/DescriptionListGroup';
import { DescriptionListTerm } from '@patternfly/react-core/dist/js/components/DescriptionList/DescriptionListTerm';
import { DescriptionListDescription } from '@patternfly/react-core/dist/js/components/DescriptionList/DescriptionListDescription';

import { useSource } from '../../hooks/useSource';
import { dateFormatter, sourceTypeFormatter } from '../../views/formatters';

const SourceSummaryCard = () => {
  const intl = useIntl();
  const source = useSource();
  const sourceTypes = useSelector(({ sources }) => sources.sourceTypes, shallowEqual);

  return (
    <Card className="pf-m-selectable pf-m-selected card summary-card pf-u-m-lg pf-u-mr-sm-on-md">
      <CardTitle>
        {intl.formatMessage({
          id: 'detail.summary.title',
          defaultMessage: 'Source Summary',
        })}
      </CardTitle>
      <CardBody>
        <DescriptionList
          columnModifier={{
            default: '2Col',
          }}
        >
          <DescriptionListGroup>
            <DescriptionListTerm>
              {intl.formatMessage({
                id: 'detail.summary.type',
                defaultMessage: 'Source type',
              })}
            </DescriptionListTerm>
            <DescriptionListDescription>
              {sourceTypeFormatter(source.source_type_id, undefined, { sourceTypes })}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>
              {intl.formatMessage({
                id: 'detail.summary.lastChecked',
                defaultMessage: 'Last availability check',
              })}
            </DescriptionListTerm>
            <DescriptionListDescription>
              {source.last_checked_at || source.last_available_at
                ? dateFormatter(source.last_checked_at || source.last_available_at)
                : intl.formatMessage({
                    id: 'detail.summary.notChecked',
                    defaultMessage: 'Not checked yet',
                  })}
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>
              {intl.formatMessage({
                id: 'detail.summary.dateAdded',
                defaultMessage: 'Date added',
              })}
            </DescriptionListTerm>
            <DescriptionListDescription>{dateFormatter(source.created_at)}</DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>
              {intl.formatMessage({
                id: 'detail.summary.lastModified',
                defaultMessage: 'Last modified',
              })}
            </DescriptionListTerm>
            <DescriptionListDescription>{dateFormatter(source.updated_at)}</DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </CardBody>
    </Card>
  );
};

export default SourceSummaryCard;
