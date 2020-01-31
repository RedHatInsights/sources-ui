import React from 'react';
import { FormattedMessage } from 'react-intl';
import { GridItem, Title, TitleLevel, Grid } from '@patternfly/react-core';

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
