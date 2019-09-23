import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
    TextContent,
    TextVariants,
    Grid,
    GridItem,
    Text,
    Button,
    ButtonVariant
} from '@patternfly/react-core';
import RemoveAppModal from './RemoveAppModal';

const AddApplicationDescription = ({ appTypes, source, sourceTypes }) => {
    const [removingApp, setApplicationRemove] = useState({});

    const sourceType = sourceTypes.find((type) => type.id === source.source_type_id);
    const appNames = source.applications
    .filter((app) => !app.isDeleting)
    .map((app) => {
        const type = appTypes.find((appType) => appType.id === app.application_type_id);

        if (type) {
            return {
                display_name: type.display_name,
                id: app.id
            };
        }
    })
    .sort((a, b) => a.display_name.localeCompare(b.display_name))
    .map(({ display_name, id }) => (
        <Grid key={id}>
            <GridItem md={4}>
                <Text component={TextVariants.p} style={{ marginBottom: 0 }}>
                    { display_name }
                </Text>
            </GridItem>
            <GridItem md={8} className="ins-c-sources__remove-app">
                <Button
                    variant={ButtonVariant.link}
                    isInline
                    onClick={() => setApplicationRemove({ id, display_name })}
                >
                    <FormattedMessage
                        id="sources.remove"
                        defaultMessage="Remove"
                    />
                </Button>
            </GridItem>
        </Grid>
    ));

    return (
        <React.Fragment>
            {removingApp.id && <RemoveAppModal
                app={removingApp}
                onCancel={() => setApplicationRemove({})}
                sourceId={source.id}
            />}
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
                        {appNames.length > 0 ? appNames : <FormattedMessage
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
