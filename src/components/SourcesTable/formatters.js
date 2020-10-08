import React from 'react';

import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { Badge } from '@patternfly/react-core/dist/js/components/Badge/Badge';
import { Popover } from '@patternfly/react-core/dist/js/components/Popover/Popover';
import { Tooltip } from '@patternfly/react-core/dist/js/components/Tooltip/Tooltip';
import { Label } from '@patternfly/react-core/dist/js/components/Label/Label';

import { FormattedMessage } from 'react-intl';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/cjs/DateFormat';

export const defaultPort = (scheme) =>
  ({
    http: '80',
    https: '443',
  }[scheme]);

export const importsTexts = (value) =>
  ({
    cfme: (
      <FormattedMessage
        id="sources.cloudformImportTooltip"
        defaultMessage="This source can be managed from your connected CloudForms application."
      />
    ),
  }[value.toLowerCase()]);

export const schemaToPort = (schema, port) => (port && String(port) !== defaultPort(schema) ? `:${port}` : '');

export const endpointToUrl = (endpoint) => {
  const onlyTrueEndpointValues = Object.keys(endpoint).reduce((acc, curr) => ({ ...acc, [curr]: endpoint[curr] || '' }), {});

  const { scheme = '', host = '', path = '', port = '' } = onlyTrueEndpointValues;

  const url = `${scheme}://${host}${schemaToPort(scheme, port)}${path}`;

  if (url === '://') {
    return;
  }

  return url;
};

export const sourceIsOpenShift = (source, sourceTypes) => {
  const type = sourceTypes.find((type) => type.id === source.source_type_id);
  return type && type.name === 'openshift';
};

export const formatURL = (source) => source.endpoints && source.endpoints[0] && endpointToUrl(source.endpoints[0]);

export const applicationFormatter = (apps, _item, { appTypes }) => {
  const applications = apps.map((app) => {
    const application = appTypes.find((type) => type.id === app.application_type_id);

    if (application) {
      return application.display_name;
    }
  });

  const filteredApplications = applications.filter((app) => typeof app !== 'undefined');

  return (
    <TextContent>
      {filteredApplications.length > 0
        ? filteredApplications
            .sort((a, b) => a.localeCompare(b))
            .map((app, index) => (
              <Text key={app} className="pf-u-mb-0-on-sm">
                {app}
                {index < filteredApplications.length - 1 && <br key={index} />}
              </Text>
            ))
        : '--'}
    </TextContent>
  );
};

export const sourceTypeFormatter = (sourceType, _item, { sourceTypes }) => {
  const type = sourceTypes.find((type) => type.id === sourceType);
  return (type && type.product_name) || sourceType || '';
};

export const dateFormatter = (str) => (
  <Text style={{ marginBottom: 0 }} component={TextVariants.p} className="ins-c-sources__help-cursor">
    <DateFormat type="relative" date={str} />
  </Text>
);

export const nameFormatter = (name, source, { sourceTypes }) => (
  <TextContent>
    {name}
    <br key={`${source.id}-br`} />
    <Text key={source.id} component={TextVariants.small}>
      {sourceIsOpenShift(source, sourceTypes) && formatURL(source)}
    </Text>
  </TextContent>
);

export const defaultFormatter = (name) => (value) => `undefined ${name} formatter of value: ${value}`;

export const importedFormatter = (value) => {
  if (!value) {
    return null;
  }

  const text = importsTexts(value);

  if (text) {
    return (
      <Tooltip content={text}>
        <Badge isRead className="ins-c-sources__help-cursor">
          <FormattedMessage id="sources.imported" defaultMessage="imported" />
        </Badge>
      </Tooltip>
    );
  }

  return (
    <Badge isRead>
      <FormattedMessage id="sources.imported" defaultMessage="imported" />
    </Badge>
  );
};

export const AVAILABLE = 'available';
export const UNAVAILABLE = 'unavailable';
export const UNKNOWN = 'unknown';
export const PARTIALLY_UNAVAILABLE = 'partially_available';

export const getStatusColor = (status) =>
  ({
    [UNAVAILABLE]: 'red',
    [AVAILABLE]: 'green',
    [PARTIALLY_UNAVAILABLE]: 'orange',
  }[status] || 'grey');

export const getStatusText = (status) =>
  ({
    [UNAVAILABLE]: <FormattedMessage id="sources.unavailable" defaultMessage="Unavailable" />,
    [AVAILABLE]: <FormattedMessage id="sources.available" defaultMessage="Available" />,
    [PARTIALLY_UNAVAILABLE]: <FormattedMessage id="sources.partiallyAvailable" defaultMessage="Partially available" />,
  }[status] || <FormattedMessage id="sources.unknown" defaultMessage="Unknown" />);

export const UnknownError = () => <FormattedMessage id="sources.unknownError" defaultMessage="unavailable" />;

export const formatAvailibilityErrors = (appTypes, errors) => (
  <React.Fragment>
    {errors.source && (
      <React.Fragment>
        <FormattedMessage
          id="sources.sourceError"
          defaultMessage="Source's status: { error }"
          values={{ error: errors.source }}
        />
        <br />
      </React.Fragment>
    )}
    {errors.endpoint && (
      <React.Fragment>
        <FormattedMessage
          id="sources.endpointError"
          defaultMessage="Endpoint error: { error }"
          values={{ error: errors.endpoint }}
        />
        <br />
      </React.Fragment>
    )}
    {errors.authentications && (
      <FormattedMessage
        id="sources.authErrors"
        defaultMessage="Authentication {count, plural, one {status} other {statuses}} : { errors }"
        values={{
          count: errors.authentications.length,
          errors: errors.authentications.map(({ error, type }) => (
            <React.Fragment key={type}>
              <FormattedMessage id="sources.errorAuthTemplate" defaultMessage="{ type }: { error }" values={{ error, type }} />
              <br />
            </React.Fragment>
          )),
        }}
      />
    )}
    {errors.applications && (
      <FormattedMessage
        id="sources.appErrors"
        defaultMessage="Application {count, plural, one {status} other {statutes}}: { errors }"
        values={{
          count: errors.applications.length,
          errors: errors.applications.map(({ error, id }) => (
            <React.Fragment key={id}>
              <FormattedMessage
                id="sources.errorAppTemplate"
                defaultMessage="{ app }: { error }"
                values={{
                  error,
                  app: appTypes.find((app) => app.id === id)?.display_name || id,
                }}
              />
              <br />
            </React.Fragment>
          )),
        }}
      />
    )}
  </React.Fragment>
);

export const getStatusTooltipText = (status, appTypes, errors = {}) =>
  ({
    [UNAVAILABLE]: (
      <React.Fragment>
        <FormattedMessage
          id="sources.appStatusPartiallyOK"
          defaultMessage="We found {count, plural, one {this error} other {these errors}}."
          values={{ count: Object.keys(errors).length }}
        />
        <hr />
        {formatAvailibilityErrors(appTypes, errors)}
      </React.Fragment>
    ),
    [AVAILABLE]: <FormattedMessage id="sources.appStatusOK" defaultMessage="Everything works fine." />,
    [PARTIALLY_UNAVAILABLE]: (
      <React.Fragment>
        <FormattedMessage
          id="sources.appStatusPartiallyOK"
          defaultMessage="We found {count, plural, one {this error} other {these errors}}."
          values={{ count: Object.keys(errors).length }}
        />
        <hr />
        {formatAvailibilityErrors(appTypes, errors)}
      </React.Fragment>
    ),
  }[status] || <FormattedMessage id="sources.appStatusUnknown" defaultMessage="Status has not been verified." />);

export const getAllErrors = ({
  availability_status,
  availability_status_error,
  applications = [],
  endpoints: [endpoint] = [],
}) => {
  let errors = {};
  let statusesCount = 0;
  let errorsCount = 0;

  if (availability_status === UNAVAILABLE) {
    errors = {
      ...errors,
      source: availability_status_error || <UnknownError />,
    };
    statusesCount++;
    errorsCount++;
  } else if (availability_status === AVAILABLE) {
    statusesCount++;
  }

  applications.map((app) => {
    if (app.availability_status === UNAVAILABLE) {
      errors = {
        ...errors,
        applications: [
          ...(errors.applications ? errors.applications : []),
          {
            id: app.application_type_id,
            error: app.availability_status_error || <UnknownError />,
          },
        ],
      };
      statusesCount++;
      errorsCount++;
    } else if (app.availability_status === AVAILABLE) {
      statusesCount++;
    }
  });

  if (endpoint?.availability_status === UNAVAILABLE) {
    errors = {
      ...errors,
      endpoint: endpoint.availability_status_error || <UnknownError />,
    };
    statusesCount++;
    errorsCount++;
  } else if (endpoint?.availability_status === AVAILABLE) {
    statusesCount++;
  }

  if (endpoint?.authentications) {
    endpoint.authentications.map((auth) => {
      if (auth.availability_status === UNAVAILABLE) {
        errors = {
          ...errors,
          authentications: [
            ...(errors.authentications ? errors.authentications : []),
            {
              type: auth.authtype,
              error: auth.availability_status_error || <UnknownError />,
            },
          ],
        };
        statusesCount++;
        errorsCount++;
      } else if (auth.availability_status === AVAILABLE) {
        statusesCount++;
      }
    });
  }

  return {
    errors,
    status:
      errorsCount === 0
        ? statusesCount === 0
          ? UNKNOWN
          : AVAILABLE
        : errorsCount === statusesCount
        ? UNAVAILABLE
        : PARTIALLY_UNAVAILABLE,
  };
};

export const availabilityFormatter = (_status, source, { appTypes }) => {
  const meta = getAllErrors(source);
  const status = meta.status;

  return (
    <TextContent className="clickable">
      <Text key={status} component={TextVariants.p}>
        <Popover aria-label={`${status} popover`} bodyContent={<h1>{getStatusTooltipText(status, appTypes, meta.errors)}</h1>}>
          <Label color={getStatusColor(status)}>{getStatusText(status)}</Label>
        </Popover>
      </Text>
    </TextContent>
  );
};

export const formatters = (name) =>
  ({
    nameFormatter,
    dateFormatter,
    applicationFormatter,
    sourceTypeFormatter,
    importedFormatter,
    availabilityFormatter,
  }[name] || defaultFormatter(name));
