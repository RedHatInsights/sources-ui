import React from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';

import { useSource } from '../../hooks/useSource';

const AddApplicationDescription = () => {
  const intl = useIntl();

  const sourceTypes = useSelector(({ sources }) => sources.sourceTypes);
  const source = useSource();

  const sourceType = sourceTypes.find((type) => type.id === source.source_type_id);
  const apps = source.applications.filter((app) => !app.isDeleting);

  const appIds = source.applications
    .filter(({ isDeleting }) => !isDeleting)
    .reduce((acc, app) => [...acc, app.application_type_id], []);

  const applicationsPart =
    apps.filter(({ id }) => !appIds.includes(id)).length > 0 ? (
      <React.Fragment>
        <Text component={TextVariants.h4} id="add-application-header">
          {intl.formatMessage({
            id: 'sources.apps',
            defaultMessage: 'Applications',
          })}
        </Text>
        <Text component={TextVariants.p} id="add-application-description">
          {intl.formatMessage({
            id: 'sources.addAppMultipleAppDesc',
            defaultMessage: 'Select a radio button to add an application. Click trash icon to remove an application.',
          })}
        </Text>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <Text component={TextVariants.h4} id="add-application-header">
          {intl.formatMessage({
            id: 'sources.addApp',
            defaultMessage: 'Add an application',
          })}
        </Text>
        <Text component={TextVariants.p} id="add-application-description">
          {intl.formatMessage({
            id: 'sources.addAppNoAppsDesc',
            defaultMessage:
              'There are currently no applications connected to this source. Select from available applications below.',
          })}
        </Text>
      </React.Fragment>
    );

  return (
    <TextContent>
      <Text component={TextVariants.h4}>
        {intl.formatMessage({
          id: 'sources.type',
          defaultMessage: 'Source type',
        })}
      </Text>
      <Text component={TextVariants.p} id="add-application-desc-type">
        {sourceType
          ? sourceType.product_name
          : intl.formatMessage({
              id: 'sources.typeNotFound',
              defaultMessage: 'Type not found',
            })}
      </Text>
      {applicationsPart}
    </TextContent>
  );
};

export default AddApplicationDescription;
