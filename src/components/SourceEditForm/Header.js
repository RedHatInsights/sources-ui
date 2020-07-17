import React from 'react';
import { useIntl } from 'react-intl';

import { Grid } from '@patternfly/react-core/dist/js/layouts/Grid/Grid';
import { GridItem } from '@patternfly/react-core/dist/js/layouts/Grid/GridItem';
import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';

const Header = () =>{
    const intl = useIntl();

    return (
        <Grid>
            <GridItem xs={12}>
                <Title headingLevel="h1" size="3xl">
                    { intl.formatMessage({
                        id: 'sources.editSource',
                        defaultMessage: 'Edit source'
                    }) }
                </Title>
            </GridItem>
            <GridItem xs={12}>
                { intl.formatMessage({
                    id: 'sources.editSourceDescription',
                    defaultMessage: 'You are editing a source.'
                }) }
            </GridItem>
        </Grid>
    );};

export default Header;
