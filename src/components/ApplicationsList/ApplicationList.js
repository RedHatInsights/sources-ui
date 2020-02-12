import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { Button, ButtonVariant } from '@patternfly/react-core/dist/js/components/Button/Button';
import { Grid } from '@patternfly/react-core/dist/js/layouts/Grid/Grid';
import { GridItem } from '@patternfly/react-core/dist/js/layouts/Grid/GridItem';

import { useSource } from '../../hooks/useSource';

const ApplicationList = ({ setApplicationToRemove, breakpoints, namePrefix }) => {
    const appTypes = useSelector(({ sources }) => sources.appTypes);
    const source = useSource();

    const sourceAppsNames = source.applications
    .map(({ application_type_id }) => {
        const appType = appTypes.find(({ id }) => id === application_type_id);
        return appType ? appType.display_name : undefined;
    });

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
                <GridItem md={breakpoints.display_name || 4}>
                    <Text component={TextVariants.p} style={{ marginBottom: 0 }}>
                        { namePrefix }{ display_name }
                    </Text>
                </GridItem>
                <GridItem md={breakpoints.remove || 8} className="ins-c-sources__remove-app">
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
    setApplicationToRemove: PropTypes.func.isRequired,
    breakpoints: PropTypes.shape({
        display_name: PropTypes.number,
        remove: PropTypes.number
    }),
    namePrefix: PropTypes.node
};

ApplicationList.defaultProps = {
    breakpoints: {}
};

export default ApplicationList;
