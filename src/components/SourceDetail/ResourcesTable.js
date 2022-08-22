import React, { useEffect, useReducer } from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';
import get from 'lodash/get';

import { Table, TableBody, TableHeader } from '@patternfly/react-table';

import { Alert, Bullseye, Card, CardBody, CardTitle, Spinner, Tab, TabTitleText, Tabs, Text } from '@patternfly/react-core';

import NoApplications from './NoApplications';
import { useSource } from '../../hooks/useSource';
import { useIsLoaded } from '../../hooks/useIsLoaded';
import { doLoadSourceForEdit } from '../../api/doLoadSourceForEdit';
import { authenticationFields } from '../SourceEditForm/parser/authentication';
import { prepareInitialValues } from '../SourceEditForm/helpers';
import ResourcesEmptyState from './ResourcesEmptyState';
import { pausedAppAlert } from '../../utilities/alerts';

const createColumns = (intl) => [
  intl.formatMessage({ id: 'resourceTable.resourceType', defaultMessage: 'Resource type' }),
  intl.formatMessage({ id: 'resourceTable.resourceValue', defaultMessage: 'Value' }),
];

const convertFieldsToRows = (fields, initialValues) =>
  fields
    .flatMap((x) => x)
    .map(
      (field) => !field.hideField && [<React.Fragment key="label">{field.label}</React.Fragment>, get(initialValues, field.name)]
    )
    .filter(Boolean);

const createRows = (source, appTypes, sourceType) => {
  const applicationsRows = source.applications.reduce((acc, app) => {
    const appType = appTypes.find(({ id }) => id === app.application_type_id);

    const applicationFieldsSchema = authenticationFields(
      app.authentications?.filter((auth) => Object.keys(auth).length > 1),
      sourceType,
      appType?.name,
      app.id
    );

    const initialValues = prepareInitialValues(source, sourceType.product_name);
    const applicationRows = convertFieldsToRows(applicationFieldsSchema, initialValues);

    return { ...acc, [app.id]: applicationRows };
  }, {});

  return applicationsRows;
};

const initialValues = (source) => ({
  loading: Boolean(source.applications?.length),
  columns: [],
  applicationsRows: {},
  activeTab: 0,
});

const reducer = (state, { type, intl, source, activeTab, appTypes, sourceType }) => {
  switch (type) {
    case 'loaded':
      return {
        ...state,
        columns: createColumns(intl),
        applicationsRows: createRows(source, appTypes, sourceType),
        loading: false,
        activeTab: source.applications[0].id,
      };
    case 'switchTab':
      return {
        ...state,
        activeTab,
      };
    case 'setLoading':
      return {
        ...state,
        loading: true,
      };
  }
};

const ResourcesTable = () => {
  const intl = useIntl();
  const source = useSource();
  const isLoaded = useIsLoaded();

  const { sourceTypes, appTypes, sourceTypesLoaded, appTypesLoaded } = useSelector(({ sources }) => sources, shallowEqual);

  const [{ activeTab, loading, columns, applicationsRows }, dispatch] = useReducer(reducer, initialValues(source));

  useEffect(() => {
    if (source && isLoaded && appTypesLoaded && sourceTypesLoaded && source?.applications?.length) {
      dispatch({ type: 'setLoading' });

      doLoadSourceForEdit(source, appTypes, sourceTypes).then((source) => {
        const sourceType = sourceTypes.find(({ id }) => id === source.source.source_type_id);

        dispatch({ type: 'loaded', source, intl, sourceType, appTypes });
      });
    }
  }, [source?.applications?.length, isLoaded, appTypesLoaded, sourceTypesLoaded]);

  return (
    <Card className="pf-u-m-lg pf-u-mt-0">
      <CardTitle>
        {intl.formatMessage({
          id: 'resourceTable.title',
          defaultMessage: 'Connected application resources',
        })}
      </CardTitle>
      <CardBody>
        {loading && (
          <Bullseye className="pf-u-m-2xl">
            <Spinner />
          </Bullseye>
        )}
        {!loading && !source.applications.length && <NoApplications />}
        {!loading && source.applications.length > 0 && (
          <React.Fragment>
            <Text className="pf-u-mb-md">
              {intl.formatMessage({
                id: 'resourceTable.description',
                defaultMessage: 'View resources for your connected applications.',
              })}
            </Text>
            <Tabs isBox activeKey={activeTab} onSelect={(_e, activeTab) => dispatch({ type: 'switchTab', activeTab })}>
              {source.applications.map((app) => {
                const appName =
                  appTypes.find(({ id }) => id === app.application_type_id)?.display_name || app.application_type_id;

                const { description, ...alertProps } = app.paused_at ? pausedAppAlert(intl, appName) : {};

                return (
                  <Tab eventKey={app.id} key={app.id} title={<TabTitleText>{appName}</TabTitleText>}>
                    {app.paused_at && !source.paused_at && (
                      <Alert isInline className="pf-u-mt-lg" {...alertProps}>
                        {description}
                      </Alert>
                    )}
                    {applicationsRows[app.id]?.length ? (
                      <Table
                        aria-label={intl.formatMessage({
                          id: 'resourceTable.title',
                          defaultMessage: 'Connected application resources',
                        })}
                        variant="compact"
                        cells={columns}
                        rows={applicationsRows[app.id]}
                        className="pf-u-mt-md"
                      >
                        <TableHeader />
                        <TableBody />
                      </Table>
                    ) : (
                      <ResourcesEmptyState applicationName={appName} />
                    )}
                  </Tab>
                );
              })}
            </Tabs>
          </React.Fragment>
        )}
      </CardBody>
    </Card>
  );
};

export default ResourcesTable;
