import React from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';

import { PageHeader } from '@redhat-cloud-services/frontend-components/components/esm/PageHeader';
import { Title } from '@patternfly/react-core/dist/esm/components/Title/Title';
import { TextContent } from '@patternfly/react-core/dist/esm/components/Text/TextContent';
import { Text } from '@patternfly/react-core/dist/esm/components/Text/Text';
import { Flex } from '@patternfly/react-core/dist/esm/layouts/Flex/Flex';
import { FlexItem } from '@patternfly/react-core/dist/esm/layouts/Flex/FlexItem';

import Breadcrumbs from './Breadcrumbs';
import { useSource } from '../../hooks/useSource';
import { availabilityFormatter } from '../../views/formatters';
import SourceKebab from './SourceKebab';

const DetailHeader = () => {
  const intl = useIntl();
  const source = useSource();
  const appTypes = useSelector(({ sources }) => sources.appTypes, shallowEqual);

  return (
    <PageHeader>
      <Breadcrumbs />
      <Flex className="pf-u-mb-sm">
        <FlexItem>
          <Title headingLevel="h1" size="2xl">
            {source.name}
          </Title>
        </FlexItem>
        <FlexItem>{availabilityFormatter(undefined, source, { appTypes })}</FlexItem>
        <FlexItem align={{ default: 'alignRight' }}>
          <SourceKebab />
        </FlexItem>
      </Flex>
      <TextContent>
        <Text>
          {intl.formatMessage({
            id: 'detail.description',
            defaultMessage: 'View details and manage connections for this source.',
          })}
        </Text>
      </TextContent>
    </PageHeader>
  );
};

export default DetailHeader;
