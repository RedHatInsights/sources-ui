import React, { useEffect, useReducer } from 'react';
import { useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';
import get from 'lodash/get';

import { Table, TableHeader, TableBody } from '@patternfly/react-table';

import { Card } from '@patternfly/react-core/dist/esm/components/Card/Card';
import { CardBody } from '@patternfly/react-core/dist/esm/components/Card/CardBody';
import { CardTitle } from '@patternfly/react-core/dist/esm/components/Card/CardTitle';
import { Text } from '@patternfly/react-core/dist/esm/components/Text';
import { Spinner } from '@patternfly/react-core/dist/esm/components/Spinner';
import { Bullseye } from '@patternfly/react-core/dist/esm/layouts/Bullseye';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core/dist/esm/components/Tabs';

import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

import NoApplications from './NoApplications';
import { useSource } from '../../hooks/useSource';
import { useIsLoaded } from '../../hooks/useIsLoaded';
import { doLoadSourceForEdit } from '../../api/doLoadSourceForEdit';
import { authenticationFields } from '../SourceEditForm/parser/authentication';
import { prepareInitialValues } from '../SourceEditForm/helpers';

const createColumns = (intl) => [
  intl.formatMessage({ id: 'resourceTable.resourceType', defaultMessage: 'Resource type' }),
  intl.formatMessage({ id: 'resourceTable.resourceValue', defaultMessage: 'Value' }),
  intl.formatMessage({ id: 'resourceTable.resourceDate', defaultMessage: 'Date created' }),
];

const findDate = (name, source) => {
  let date;

  if (name.startsWith('applications')) {
    const id = name.replace(/([a-z]|\.)/g, '');
    date = source.applications.find((app) => app.id === id)?.created_at;
  } else {
    date = source.source.created_at;
  }

  return (
    <span className="ins-c-sources__help-cursor">
      <DateFormat type="relative" date={date} />
    </span>
  );
};

const convertFieldsToRows = (fields, initialValues, source) =>
  fields
    .flatMap((x) => x)
    .map(
      (field) =>
        !field.hideField && [
          <React.Fragment key="label">{field.label}</React.Fragment>,
          get(initialValues, field.name),
          findDate(field.name, source),
        ]
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
    const applicationRows = convertFieldsToRows(applicationFieldsSchema, initialValues, source);

    return { ...acc, [app.id]: applicationRows };
  }, {});

  return applicationsRows;
};

const initialValues = {
  loading: true,
  columns: [],
  applicationsRows: {},
  activeTab: 0,
};

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
  }
};

const ResourcesTable = () => {
  const intl = useIntl();
  const source = useSource();
  const isLoaded = useIsLoaded();

  const { sourceTypes, appTypes, sourceTypesLoaded, appTypesLoaded } = useSelector(({ sources }) => sources, shallowEqual);

  const [{ activeTab, loading, columns, applicationsRows }, dispatch] = useReducer(reducer, initialValues);

  useEffect(() => {
    if (source && isLoaded && appTypesLoaded && sourceTypesLoaded) {
      doLoadSourceForEdit(source, appTypes, sourceTypes).then((source) => {
        const sourceType = sourceTypes.find(({ id }) => id === source.source.source_type_id);

        dispatch({ type: 'loaded', source, intl, sourceType, appTypes });
      });
    }
  }, [source?.applications?.length, isLoaded, appTypesLoaded, sourceTypesLoaded]);

  return (
    <Card className="card pf-u-m-lg pf-u-mt-0">
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
        {!loading && source.applications.length && (
          <React.Fragment>
            <Text className="pf-u-mb-md">
              {intl.formatMessage({
                id: 'resourceTable.description',
                defaultMessage: 'View resources for your connected applications.',
              })}
            </Text>
            <Tabs isBox activeKey={activeTab} onSelect={(_e, activeTab) => dispatch({ type: 'switchTab', activeTab })}>
              {source.applications.map((app) => (
                <Tab
                  eventKey={app.id}
                  key={app.id}
                  title={
                    <TabTitleText>
                      {appTypes.find(({ id }) => id === app.application_type_id)?.display_name || app.application_type_id}
                    </TabTitleText>
                  }
                >
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
                </Tab>
              ))}
            </Tabs>
          </React.Fragment>
        )}
      </CardBody>
    </Card>
  );
};

export default ResourcesTable;
