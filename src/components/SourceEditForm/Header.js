import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Grid } from '@patternfly/react-core/dist/js/layouts/Grid/Grid';
import { GridItem } from '@patternfly/react-core/dist/js/layouts/Grid/GridItem';
import { Title, TitleLevel } from '@patternfly/react-core/dist/js/components/Title/Title';

const Header = () => (
    <Grid>
        <GridItem xs={12}>
            <Title headingLevel={TitleLevel.h1} size="3xl">
                <FormattedMessage
                    id="sources.editSource"
                    defaultMessage="Edit a source"
                />
            </Title>
        </GridItem>
        <GridItem xs={12}>
            <FormattedMessage
                id="sources.editSourceDescription"
                defaultMessage="You are editing a source."
            />
        </GridItem>
    </Grid>
);

export default Header;
