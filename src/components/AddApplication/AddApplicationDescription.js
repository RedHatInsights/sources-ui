import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';

import { useSource } from '../../hooks/useSource';

const AddApplicationDescription = ({ appIds }) => {
    const intl = useIntl();

    const sourceTypes = useSelector(({ sources }) => sources.sourceTypes);
    const source = useSource();

    const sourceType = sourceTypes.find((type) => type.id === source.source_type_id);
    const apps = source.applications.filter((app) => !app.isDeleting);

    const applicationsPart = apps.filter(({ id }) => !appIds.includes(id)).length > 0 ? (<React.Fragment>
        <Text component={TextVariants.h4}>
            { intl.formatMessage({
                id: 'sources.apps',
                defaultMessage: 'Applications'
            }) }
        </Text>
        <Text component={TextVariants.p}>
            {intl.formatMessage({
                id: 'sources.addAppMultipleAppDesc',
                defaultMessage: 'Select a radio button to add an application. Click trash icon to remove an application.'
            })}
        </Text>
    </React.Fragment>) : (<React.Fragment>
        <Text component={TextVariants.h4}>
            { intl.formatMessage({
                id: 'sources.addApp',
                defaultMessage: 'Add an application'
            }) }
        </Text>
        <Text component={TextVariants.p}>
            {intl.formatMessage({
                id: 'sources.addAppNoAppsDesc',
                // eslint-disable-next-line max-len
                defaultMessage: 'There are currently no applications connected to this source. Select from available applications below.'
            })}
        </Text>
    </React.Fragment>);

    return (
        <React.Fragment>
            <TextContent>
                <Text component={TextVariants.h4}>
                    { intl.formatMessage({
                        id: 'sources.type',
                        defaultMessage: 'Source type'
                    }) }
                </Text>
                <Text component={TextVariants.p} id="add-application-desc-type">
                    { sourceType ? sourceType.product_name : intl.formatMessage({
                        id: 'sources.typeNotFound',
                        defaultMessage: 'Type not found'
                    })}
                </Text>
                {applicationsPart}
            </TextContent>
        </React.Fragment>
    );
};

AddApplicationDescription.propTypes = {
    container: PropTypes.instanceOf(Element),
    appIds: PropTypes.array
};

export default AddApplicationDescription;
