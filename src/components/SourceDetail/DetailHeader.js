import React from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';

import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Content, Flex, FlexItem, Title } from '@patternfly/react-core';

import Breadcrumbs from './Breadcrumbs';
import { useSource } from '../../hooks/useSource';
import { availabilityFormatter } from '../../views/formatters';
import SourceKebab from './SourceKebab';

const DetailHeader = () => {
  const intl = useIntl();
  const source = useSource();
  const appTypes = useSelector(({ sources }) => sources.appTypes, shallowEqual);
  const sourceTypes = useSelector(({ sources }) => sources.sourceTypes, shallowEqual);

  return (
    <PageHeader>
      <Breadcrumbs />
      <Flex className="pf-v6-u-mb-sm">
        <FlexItem>
          <Title headingLevel="h1" size="2xl">
            {source.name}
          </Title>
        </FlexItem>
        <FlexItem>{availabilityFormatter(undefined, source, { appTypes, sourceTypes })}</FlexItem>
        <FlexItem align={{ default: 'alignRight' }}>
          <SourceKebab />
        </FlexItem>
      </Flex>
      <Content>
        <Content component="p">
          {intl.formatMessage({
            id: 'detail.description',
            defaultMessage: 'View details and manage connections for this integration.',
          })}
        </Content>
      </Content>
    </PageHeader>
  );
};

export default DetailHeader;
