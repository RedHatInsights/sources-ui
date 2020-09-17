import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { Grid, GridItem } from '@patternfly/react-core/dist/js/layouts/Grid/index';

const AdditionalInfoBar = ({ sourceType, applications }) => {
    const intl = useIntl();
    const appTypes = useSelector(({ sources }) => sources.appTypes);

    const sourceAppsNames = applications?.map(({ application_type_id }) => {
        const appType = appTypes.find(({ id }) => id === application_type_id);
        return appType ? appType.display_name : undefined;
    }) || [];

    return (
        <TextContent>
            <Grid hasGutter>
                <GridItem md={2}>
                    <Text component={TextVariants.h4}>
                        { intl.formatMessage({
                            id: 'sources.sourceType',
                            defaultMessage: 'Source type'
                        }) }
                    </Text>
                    <Text component={TextVariants.p} id="source-edit-type">
                        { sourceType.product_name }
                    </Text>
                </GridItem>
                <GridItem md={8}>
                    <Text component={TextVariants.h4}>
                        { intl.formatMessage({
                            id: 'sources.apps',
                            defaultMessage: 'Applications'
                        }) }
                    </Text>
                    <Text component={TextVariants.p} id="source-edit-apps">
                        {sourceAppsNames.length > 0 ? sourceAppsNames.join(', ')
                            : (
                                intl.formatMessage({
                                    id: 'sources.none',
                                    defaultMessage: 'None'
                                })
                            )
                        }
                    </Text>
                </GridItem>
            </Grid>
        </TextContent>
    );
};

AdditionalInfoBar.propTypes = {
    sourceType: PropTypes.shape({
        product_name: PropTypes.string.isRequired
    }),
    applications: PropTypes.arrayOf(PropTypes.shape({
        application_type_id: PropTypes.string.isRequired
    }))
};

export default AdditionalInfoBar;
