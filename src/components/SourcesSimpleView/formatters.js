import React from 'react';
import { Text, TextContent, TextVariants, Badge, Tooltip, Popover } from '@patternfly/react-core';
import { FormattedMessage } from 'react-intl';
import { DateFormat } from '@redhat-cloud-services/frontend-components';
import { CheckCircleIcon, QuestionCircleIcon, ExclamationTriangleIcon, TimesCircleIcon } from '@patternfly/react-icons';

export const defaultPort = (scheme) => ({
    http: '80',
    https: '443'
}[scheme]);

export const importsTexts = (value) => ({
    cfme: <FormattedMessage
        id="sources.cloudformImportTooltip"
        defaultMessage="This source can be managed from your connected CloudForms application."
    />
}[value.toLowerCase()]);

export const schemaToPort = (schema, port) => port && String(port) !== defaultPort(schema) ? `:${port}` : '';

export const endpointToUrl = ({ scheme, host, path, port }) => (
    `${scheme}://${host}${schemaToPort(scheme, port)}${path || ''}`
);

export const sourceIsOpenShift = (source, sourceTypes) => {
    const type = sourceTypes.find((type) => type.id === source.source_type_id);
    return type && type.name === 'openshift';
};

export const formatURL = source => source.endpoints && source.endpoints[0] && endpointToUrl(source.endpoints[0]);

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
            {filteredApplications.length > 0 ? filteredApplications.sort((a, b) => a.localeCompare(b)).map((app, index) => (
                <Text key={app} className="pf-u-mb-0-on-sm">
                    {app}
                    {index < filteredApplications.length - 1 && <br key={index}/>}
                </Text>
            )) : '--'}
        </TextContent>
    );
};

export const sourceTypeFormatter = (sourceType, _item, { sourceTypes }) => {
    const type = sourceTypes.find((type) => type.id === sourceType);
    return (type && type.product_name) || sourceType || '';
};

export const dateFormatter = str => (
    <Text
        style={ { marginBottom: 0 } }
        component={ TextVariants.p }
        className='ins-c-sources__help-cursor'
    >
        <DateFormat type='relative' date={str} />
    </Text>
);

export const nameFormatter = (name, source, { sourceTypes }) => (
    <TextContent>
        {name}
        <br key={`${source.id}-br`}/>
        <Text key={source.id} component={ TextVariants.small }>
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
        return (<Tooltip content={text}>
            <Badge isRead className='ins-c-sources__help-cursor'>
                <FormattedMessage
                    id="sources.imported"
                    defaultMessage="imported"
                />
            </Badge>
        </Tooltip>);
    }

    return (<Badge isRead>
        <FormattedMessage
            id="sources.imported"
            defaultMessage="imported"
        />
    </Badge>);
};

export const getStatusIcon = (status) => ({
    unavailable: <TimesCircleIcon className="ins-c-sources__availability-not-ok"/>,
    available: <CheckCircleIcon className="ins-c-sources__availability-ok"/>,
    partially_available: <ExclamationTriangleIcon className="ins-c-sources__availability-partially"/>
}[status] || <QuestionCircleIcon className="ins-c-sources__availability-unknown"/>);

export const getStatusText = (status) => ({
    unavailable: <FormattedMessage
        id="sources.unavailable"
        defaultMessage="Unavailable"
    />,
    available: <FormattedMessage
        id="sources.ok"
        defaultMessage="OK"
    />,
    partially_available: <FormattedMessage
        id="sources.partiallyAvailable"
        defaultMessage="Partially available"
    />
}[status] || <FormattedMessage
    id="sources.unknown"
    defaultMessage="Unknown"
/>);

export const formatAvailibilityErrors = (source, appTypes) => {
    if (source.applications && source.applications.length > 0) {
        return source.applications.map(
            ({ application_type_id, availability_status_error }) => {
                const application = appTypes.find(({ id }) => id === application_type_id);
                const applicationName = application ? application.display_name : '';

                if (availability_status_error) {
                    return `${availability_status_error} \n ${applicationName ? `(${applicationName})` : ''}`;
                }

                return (<FormattedMessage
                    key="availability_status_error"
                    id="sources.unknownAppError"
                    defaultMessage="Unknown application error ({ appName })"
                    values={{ appName: applicationName }}
                />);
            }
        ).join(' ');
    }

    return (<FormattedMessage
        key="availability_status_error"
        id="sources.unknownAppError"
        defaultMessage="Unknown source error."
    />);
};

export const getStatusTooltipText = (status, source, appTypes) => ({
    unavailable: <React.Fragment>
        <FormattedMessage
            id="sources.appStatusPartiallyOK"
            defaultMessage="We found these errors:"
        />&nbsp;
        {formatAvailibilityErrors(source, appTypes)}
    </React.Fragment>,
    available: <FormattedMessage
        id="sources.appStatusOK"
        defaultMessage="Everything works fine - all applications are connected"
    />,
    partially_available: <React.Fragment>
        <FormattedMessage
            id="sources.appStatusPartiallyOK"
            defaultMessage="We found these errors:"
        />
        {formatAvailibilityErrors(source, appTypes)}
    </React.Fragment>
}[status] || <FormattedMessage
    id="sources.appStatusUnknown"
    defaultMessage="Status has not been verified."
/>);

export const availabilityFormatter = (status, source, { appTypes }) => (<TextContent>
    <Popover
        aria-label="Headless Popover"
        bodyContent={<h1>{getStatusTooltipText(status, source, appTypes)}</h1>}
    >
        <Text key={status} component={ TextVariants.p }>
            {getStatusIcon(status)}&nbsp;
            {getStatusText(status)}
        </Text>
    </Popover>
</TextContent>);

export const formatters = (name) => ({
    nameFormatter,
    dateFormatter,
    applicationFormatter,
    sourceTypeFormatter,
    importedFormatter,
    availabilityFormatter
}[name] || defaultFormatter(name));
