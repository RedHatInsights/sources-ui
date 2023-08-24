import React from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';

import { useSource } from '../../hooks/useSource';
import { configurationModeFormatter, dateFormatter, sourceTypeFormatter } from '../../views/formatters';
import AvailabilityChecker from './AvailabilityChecker';
import { setCheckPenging } from '../../redux/sources/actions';

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
  const dispatch = useDispatch();
  const intl = useIntl();
  const source = useSource();
  const sourceTypes = useSelector(({ sources }) => sources.sourceTypes, shallowEqual);
  const type = sourceTypes.find((type) => type.id === source.source_type_id);

  let awsAccountNumber;

  if (type?.name === 'amazon') {
    const arnType = source.authentications?.find(({ authtype }) => authtype.includes('arn'));

    if (arnType?.username) {
      awsAccountNumber = arnType.username.match(/:\d+/)?.[0]?.replace(/:/g, '');
    }
  }

  return (
    <Card className="pf-m-selectable pf-m-selected src-c-card-summary pf-v5-u-m-lg pf-v5-u-mr-sm-on-md">
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
                {source.isCheckPending || !(source.last_checked_at || source.last_available_at)
                  ? intl.formatMessage({
                      id: 'detail.summary.waitingForUpdate',
                      defaultMessage: 'Waiting for update',
                    })
                  : dateFormatter(source.last_checked_at || source.last_available_at)}
                <AvailabilityChecker setCheckPending={() => dispatch(setCheckPenging(source.id))} />
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
              description={configurationModeFormatter(source.app_creation_workflow, source, { intl, sourceType: type })}
            />
          )}
          {awsAccountNumber && (
            <DescriptionListItem
              term={intl.formatMessage({
                id: 'detail.summary.awsAccountNumber',
                defaultMessage: 'AWS account number',
              })}
              description={awsAccountNumber}
            />
          )}
        </DescriptionList>
      </CardBody>
    </Card>
  );
};

export default SourceSummaryCard;
