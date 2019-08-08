import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
    TextContent,
    TextVariants,
    Grid,
    GridItem,
    Text
} from '@patternfly/react-core';

const AddApplicationDescription = ({ appTypes, source, sourceTypes }) => {
    const sourceType = sourceTypes.find((type) => type.id === source.source_type_id);
    const appNames = source.applications.map((app) => {
        const type = appTypes.find((appType) => appType.id === app.application_type_id);

        if (type) {
            return type.display_name;
        }
    }).map((name) => (
        <Text key={name} component={TextVariants.p} style={{ marginBottom: 0 }}>
            {name}
        </Text>
    ));

    return (
        <TextContent>
            <Grid gutter="md">
                <GridItem md={12}>
                    <Text component={TextVariants.h1}>
                        <FormattedMessage
                            id="sources.selectApp"
                            defaultMessage="Select application"
                        />
                    </Text>
                </GridItem>
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
                <GridItem md={4}>
                    <Text component={TextVariants.h4}>
                        <FormattedMessage
                            id="sources.apps"
                            defaultMessage="Applications"
                        />
                    </Text>
                </GridItem>
                <GridItem md={4} />
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
                <GridItem md={4}>
                    {appNames.length > 0 ? appNames : <FormattedMessage
                        id="sources.noApps"
                        defaultMessage="No applications"
                    />}
                </GridItem>
            </Grid>
        </TextContent>
    );
};

AddApplicationDescription.propTypes = {
    sourceTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        product_name: PropTypes.string.isRequired
    })),
    appTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        display_name: PropTypes.string.isRequired
    })),
    source: PropTypes.shape({
        name: PropTypes.string.isRequired,
        source_type_id: PropTypes.string.isRequired,
        application_type_id: PropTypes.number
    })
};

const mapStateToProps = ({ providers: { entities, appTypes, sourceTypes } }, { match: { params: { id } } }) =>
    ({ source: entities.find(source => source.id  === id), appTypes, sourceTypes });

export default withRouter(connect(mapStateToProps)(AddApplicationDescription));
