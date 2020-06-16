import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { Grid, GridItem } from '@patternfly/react-core/dist/js/layouts/Grid/index';

import RemoveAppModal from './RemoveAppModal';
import ApplicationList from '../ApplicationsList/ApplicationList';
import { useSource } from '../../hooks/useSource';

const AddApplicationDescription = ({ container }) => {
    const [removingApp, setApplicationToRemove] = useState({});

    const sourceTypes = useSelector(({ sources }) => sources.sourceTypes);
    const source = useSource();

    const sourceType = sourceTypes.find((type) => type.id === source.source_type_id);
    const apps = source.applications.filter((app) => !app.isDeleting);

    return (
        <React.Fragment>
            {removingApp.id && <RemoveAppModal
                app={removingApp}
                onCancel={() => {
                    if (container) {
                        container.hidden = false;
                    }

                    return setApplicationToRemove({});
                }}
                container={container}
            />}
            <TextContent>
                <Grid gutter="md">
                    <GridItem md={2}>
                        <Text component={TextVariants.h4}>
                            <FormattedMessage
                                id="sources.sourceName"
                                defaultMessage="Source name"
                            />
                        </Text>
                    </GridItem>
                    <GridItem md={2}>
                        <Text component={TextVariants.h4}>
                            <FormattedMessage
                                id="sources.type"
                                defaultMessage="Type"
                            />
                        </Text>
                    </GridItem>
                    <GridItem md={8}>
                        <Text component={TextVariants.h4}>
                            <FormattedMessage
                                id="sources.apps"
                                defaultMessage="Applications"
                            />
                        </Text>
                    </GridItem>
                    <GridItem md={2}>
                        <Text component={TextVariants.p}>
                            {source.name}
                        </Text>
                    </GridItem>
                    <GridItem md={2}>
                        <Text component={TextVariants.p}>
                            { sourceType ? sourceType.product_name : <FormattedMessage
                                id="sources.typeNotFound"
                                defaultMessage="Type not found"
                            />}
                        </Text>
                    </GridItem>
                    <GridItem md={8}>
                        {apps.length > 0 ? <ApplicationList setApplicationToRemove={setApplicationToRemove}/> : <FormattedMessage
                            id="sources.noApps"
                            defaultMessage="No applications"
                        />}
                    </GridItem>
                </Grid>
            </TextContent>
        </React.Fragment>
    );
};

AddApplicationDescription.propTypes = {
    container: PropTypes.instanceOf(Element)
};

export default AddApplicationDescription;
