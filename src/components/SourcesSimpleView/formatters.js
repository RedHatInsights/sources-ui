import React from 'react';
import moment from 'moment';
import { Text, TextContent, TextVariants, Badge, Tooltip } from '@patternfly/react-core';
import { FormattedMessage } from 'react-intl';

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

export const dateFormatter = str => moment(new Date(Date.parse(str))).utc().format('DD MMM YYYY, hh:mm UTC');
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
            <Badge isRead>
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

export const formatters = (name) => ({
    nameFormatter,
    dateFormatter,
    applicationFormatter,
    sourceTypeFormatter,
    importedFormatter
}[name] || defaultFormatter(name));
