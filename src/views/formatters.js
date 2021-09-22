import React from 'react';
import PropTypes from 'prop-types';

import { Text, TextVariants, TextContent, Badge, Popover, Tooltip, Label, LabelGroup, Button } from '@patternfly/react-core';

import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import WrenchIcon from '@patternfly/react-icons/dist/esm/icons/wrench-icon';
import PauseIcon from '@patternfly/react-icons/dist/esm/icons/pause-icon';

import { FormattedMessage, useIntl } from 'react-intl';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { Link } from 'react-router-dom';
import { replaceRouteId, routes } from '../Routes';
import isSourceAzureRHEL from '../utilities/isSourceAzureRHEL';

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

export const sourceTypeFormatter = (sourceType, _item, { sourceTypes }) => {
  const type = sourceTypes.find((type) => type.id === sourceType);
  return (type && type.product_name) || sourceType || '';
};

export const dateFormatter = (str) => (
  <span className="ins-c-sources__help-cursor">
    <DateFormat type="relative" date={str} />
  </span>
);

export const nameFormatter = (name, source, { sourceTypes }) => (
  <TextContent>
    <Link to={replaceRouteId(routes.sourcesDetail.path, source.id)}>{name}</Link>
    <br key={`${source.id}-br`} />
    <Text key={source.id} component={TextVariants.small}>
      {sourceIsOpenShift(source, sourceTypes) && formatURL(source)}
    </Text>
  </TextContent>
);

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
export const IN_PROGRESS = 'in_progress';
export const PAUSED = 'paused_at';
export const RHELAZURE = 'rhel_azure';

export const getStatusColor = (status) =>
  ({
    [UNAVAILABLE]: 'red',
    [AVAILABLE]: 'green',
    [PARTIALLY_UNAVAILABLE]: 'orange',
    [PAUSED]: 'cyan',
  }[status] || 'grey');

export const getStatusText = (status) =>
  ({
    [UNAVAILABLE]: <FormattedMessage id="sources.unavailable" defaultMessage="Unavailable" />,
    [AVAILABLE]: <FormattedMessage id="sources.available" defaultMessage="Available" />,
    [PARTIALLY_UNAVAILABLE]: <FormattedMessage id="sources.partiallyAvailable" defaultMessage="Partially available" />,
    [IN_PROGRESS]: <FormattedMessage id="sources.inProgress" defaultMessage="In progress" />,
    [PAUSED]: <FormattedMessage id="sources.paused" defaultMessage="Paused" />,
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
    [IN_PROGRESS]: (
      <FormattedMessage
        id="sources.inProgressStatus"
        defaultMessage="We are still working to validate credentials. Check back for status updates."
      />
    ),
    [PAUSED]: (
      <FormattedMessage
        id="sources.pausedStatus"
        defaultMessage="Data collection is temporarily disabled. Resume source to reestablish connection."
      />
    ),
    [RHELAZURE]: (
      <FormattedMessage
        id="sources.rhelAzureStatus"
        defaultMessage="This source cannot currently be monitored in Sources, and does not reflect true status of resources."
      />
    ),
  }[status] || <FormattedMessage id="sources.appStatusUnknown" defaultMessage="Status has not been verified." />);

export const getAllErrors = ({
  availability_status,
  availability_status_error,
  applications = [],
  endpoints: [endpoint] = [],
}) => {
  if (availability_status === IN_PROGRESS) {
    return { errors: {}, status: IN_PROGRESS };
  }

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

export const availabilityFormatter = (_status, source, { appTypes, sourceTypes }) => {
  const meta = getAllErrors(source);
  const status = source.paused_at ? PAUSED : isSourceAzureRHEL({ source, sourceTypes, appTypes }) ? RHELAZURE : meta.status;

  return (
    <span>
      <Popover
        showClose={false}
        aria-label={`${status} popover`}
        bodyContent={getStatusTooltipText(status, appTypes, meta.errors)}
      >
        <Label
          className="clickable"
          color={getStatusColor(status)}
          {...(source.availability_status === IN_PROGRESS && { icon: <WrenchIcon /> })}
          {...(source.paused_at && { icon: <PauseIcon /> })}
        >
          {getStatusText(status)}
        </Label>
      </Popover>
    </span>
  );
};

export const getStatusTooltipTextApp = (status, error, intl) =>
  ({
    [AVAILABLE]: intl.formatMessage({
      id: 'sources.appStatusOK',
      defaultMessage: 'Everything works fine.',
    }),
    [UNAVAILABLE]: error || intl.formatMessage({ id: 'sources.unknownError', defaultMessage: 'Unknown error' }),
    [IN_PROGRESS]: (
      <FormattedMessage
        id="sources.inProgressStatus"
        defaultMessage="We are still working to validate credentials. Check back for status updates."
      />
    ),
  }[status] ||
  intl.formatMessage({
    id: 'sources.appStatusUnknown',
    defaultMessage: 'Status has not been verified.',
  }));

export const ApplicationLabel = ({ app, showStatusText, ...props }) => {
  const intl = useIntl();

  const statusText = getStatusTooltipTextApp(app.availability_status, app.availability_status_error, intl);

  return (
    <Popover
      showClose={false}
      key={app.display_name}
      aria-label={`${app.display_name} popover`}
      bodyContent={
        app.paused_at
          ? `${statusText} ${intl.formatMessage({
              id: 'appplication.paused.additionalText',
              defaultMessage: 'Resume this application to continue data collection.',
            })}`
          : statusText
      }
      {...(app.paused_at && {
        headerContent: intl.formatMessage({
          id: 'application.paused.header',
          defaultMessage: 'Application paused',
        }),
      })}
    >
      <Label
        className="clickable"
        color={getStatusColor(app.availability_status)}
        {...(app.availability_status === IN_PROGRESS && { icon: <WrenchIcon /> })}
        {...(app.paused_at && { icon: <PauseIcon /> })}
        {...props}
      >
        {showStatusText ? getStatusText(app.availability_status) : app.display_name}
      </Label>
    </Popover>
  );
};

ApplicationLabel.propTypes = {
  app: PropTypes.shape({
    display_name: PropTypes.string,
    availability_status: PropTypes.string,
    availability_status_error: PropTypes.string,
    paused_at: PropTypes.string,
  }),
  showStatusText: PropTypes.bool,
};

const EnhancedLabelGroup = ({ applications, ...props }) => {
  const intl = useIntl();

  return (
    <LabelGroup
      {...props}
      numLabels={2}
      collapsedText={intl.formatMessage(
        { id: 'applications.showMore', defaultMessage: '{remaining} more' },
        { remaining: '${remaining}' }
      )}
    >
      {applications.map((app, index) => (
        <ApplicationLabel app={app} key={app.id || index} />
      ))}
    </LabelGroup>
  );
};

EnhancedLabelGroup.propTypes = {
  applications: PropTypes.arrayOf(
    PropTypes.shape({
      display_name: PropTypes.string,
      availability_status: PropTypes.string,
      availability_status_error: PropTypes.string,
      paused_at: PropTypes.string,
    })
  ).isRequired,
};

export const getAppStatus = (app, source, appTypes) => {
  const application = appTypes.find((type) => type.id === app.application_type_id);

  if (application) {
    let availability_status = app.availability_status;
    let availability_status_error = app.availability_status_error;

    if (app.authentications?.[0]?.resource_type === 'Endpoint') {
      availability_status = source.endpoints?.[0]?.availability_status;
      availability_status_error = source.endpoints?.[0]?.availability_status_error;
    }

    return {
      display_name: application.display_name,
      paused_at: app.paused_at,
      availability_status,
      availability_status_error,
    };
  }
};

export const applicationFormatter = (apps, item, { appTypes }) => {
  const applications = apps
    .map((app) => getAppStatus(app, item, appTypes))
    .filter(Boolean)
    .sort((a, b) => a.display_name.localeCompare(b.display_name));

  if (applications.length === 0) {
    return '--';
  }

  return <EnhancedLabelGroup numLabels={2} collapsedText applications={applications} />;
};

export const configurationModeFormatter = (mode, item, { intl, sourceType }) => {
  if (mode === 'account_authorization') {
    const superKeyType = sourceType?.schema.authentication.find(({ is_superkey }) => is_superkey);
    const superKeyAuth = item?.authentications?.find(({ authtype }) => authtype && authtype === superKeyType.type);

    return (
      <React.Fragment>
        {intl.formatMessage({
          id: 'configurationMode.trust',
          defaultMessage: 'Account authorization',
        })}
        {superKeyAuth?.availability_status === UNAVAILABLE && (
          <Tooltip
            position="top"
            content={
              superKeyAuth.availability_status_error ||
              intl.formatMessage({
                id: 'configurationMode.trustmode.defaultError',
                defaultMessage: 'Edit credentials required.',
              })
            }
          >
            <span className="pf-u-ml-sm">
              <ExclamationCircleIcon fill="#C9190B" />
            </span>
          </Tooltip>
        )}
        <div className="pf-u-mt-sm">
          <Link to={replaceRouteId(routes.sourcesDetailEditCredentials.path, item.id)}>
            <Button variant="link" id="edit-super-credentials" isInline>
              {item.paused_at
                ? intl.formatMessage({
                    id: 'sources.viewCredentials',
                    defaultMessage: 'View credentials',
                  })
                : intl.formatMessage({
                    id: 'sources.editCredentials',
                    defaultMessage: 'Edit credentials',
                  })}
            </Button>
          </Link>
        </div>
      </React.Fragment>
    );
  }

  return intl.formatMessage({
    id: 'configurationMode.manual',
    defaultMessage: 'Manual configuration',
  });
};
