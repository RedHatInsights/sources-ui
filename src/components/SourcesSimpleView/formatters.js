import React from 'react';
import moment from 'moment';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';

import { endpointToUrl } from '../../components/SourceEditForm/editSourceSchema';

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
            {filteredApplications.sort((a, b) => a.localeCompare(b)).map((app, index) => (
                <Text key={app}>
                    {app}
                    {index < filteredApplications.length - 1 && <br key={index}/>}
                </Text>
            ))}
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

export const defaultFormatter = (value) => `undefined formatter for: ${value}`;

export const formatters = (name) => ({
    nameFormatter,
    dateFormatter,
    applicationFormatter,
    sourceTypeFormatter
}[name] || defaultFormatter);
