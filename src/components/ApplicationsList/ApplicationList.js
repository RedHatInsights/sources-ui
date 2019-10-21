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
    Text,
    Button,
    ButtonVariant
} from '@patternfly/react-core';

const ApplicationList = ({ appTypes, source, setApplicationToRemove }) => {
    const sourceAppsNames = source.applications
    .map(({ application_type_id }) => appTypes.find(({ id }) => id === application_type_id).display_name);

    return source.applications
    .filter((app) => !app.isDeleting)
    .map((app) => {
        const type = appTypes.find((appType) => appType.id === app.application_type_id);

        if (type) {
            return {
                display_name: type.display_name,
                id: app.id,
                dependent_applications: type.dependent_applications
            };
        }
    })
    .sort((a, b) => a.display_name.localeCompare(b.display_name))
    .map(({ display_name, id, dependent_applications }) => (
        <TextContent key={id}>
            <Grid>
                <GridItem md={4}>
                    <Text component={TextVariants.p} style={{ marginBottom: 0 }}>
                        { display_name }
                    </Text>
                </GridItem>
                <GridItem md={8} className="ins-c-sources__remove-app">
                    <Button
                        variant={ButtonVariant.link}
                        isInline
                        onClick={() => setApplicationToRemove({ id, display_name, dependent_applications, sourceAppsNames })}
                    >
                        <FormattedMessage
                            id="sources.remove"
                            defaultMessage="Remove"
                        />
                    </Button>
                </GridItem>
            </Grid>
        </TextContent>
    ));
};

ApplicationList.propTypes = {
    appTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        display_name: PropTypes.string.isRequired
    })).isRequired,
    source: PropTypes.shape({
        name: PropTypes.string.isRequired,
        source_type_id: PropTypes.string.isRequired,
        application_type_id: PropTypes.number
    }).isRequired,
    setApplicationToRemove: PropTypes.func.isRequired
};

const mapStateToProps = ({ providers: { entities, appTypes } }, { match: { params: { id } } }) =>
    ({ source: entities.find(source => source.id  === id), appTypes });

export default withRouter(connect(mapStateToProps)(ApplicationList));
