import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
    TextContent,
    TextVariants,
    Grid,
    GridItem,
    Text
} from '@patternfly/react-core';

import RemoveAppModal from './RemoveAppModal';
import ApplicationList from '../ApplicationsList/ApplicationList';
import RedirectNoId from '../RedirectNoId/RedirectNoId';
import { useSource } from '../../hooks/useSource';

const AddApplicationDescription = ({ match: { params: { id } } }) => {
    const [removingApp, setApplicationToRemove] = useState({});

    const sourceTypes = useSelector(({ providers }) => providers.sourceTypes);
    const source = useSource(id);

    if (!source) {
        return <RedirectNoId />;
    }

    const sourceType = sourceTypes.find((type) => type.id === source.source_type_id);
    const apps = source.applications.filter((app) => !app.isDeleting);

    return (
        <React.Fragment>
            {removingApp.id && <RemoveAppModal
                app={removingApp}
                onCancel={() => setApplicationToRemove({})}
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
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default withRouter(AddApplicationDescription);
