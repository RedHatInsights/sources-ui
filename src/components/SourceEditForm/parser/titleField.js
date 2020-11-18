import React from 'react';
import PropTypes from 'prop-types';

import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';
import { Text } from '@patternfly/react-core/dist/js/components/Text/Text';

export const TitleAndDescription = ({ title, description }) => (
  <TextContent>
    <Title headingLevel="h2" className="pf-u-mb-0">
      {title}
    </Title>
    {description && <Text variant="p">{description}</Text>}
  </TextContent>
);

TitleAndDescription.propTypes = {
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
};

const titleField = (applications, sourceType, appTypes, intl, authentications) => {
  let title;
  let description;

  if (applications.length === 0) {
    title = intl.formatMessage(
      {
        id: 'source.editTitleNoApp',
        defaultMessage: '{type} credentials',
      },
      { type: sourceType?.product_name }
    );
  } else if (applications.length === 1) {
    const app = appTypes.find(({ id }) => id === applications[0].application_type_id);
    title = intl.formatMessage(
      {
        id: 'source.editTitleOneApp',
        defaultMessage: '{type} & {app} credentials',
      },
      { type: sourceType?.product_name, app: app?.display_name }
    );
  } else {
    title = intl.formatMessage(
      {
        id: 'source.editTitleMoreApps',
        defaultMessage: '{type} & application credentials',
      },
      { type: sourceType?.product_name }
    );
    description = intl.formatMessage({
      id: 'source.editDescriptionMoreApps',
      defaultMessage: 'Use the tabs below to view and edit credentials for connected applications.',
    });
  }

  return {
    component: 'description',
    name: 'edit-title',
    Content: TitleAndDescription,
    title,
    description,
    hideField: applications?.length === 0 && authentications?.length === 0,
  };
};

export default titleField;
