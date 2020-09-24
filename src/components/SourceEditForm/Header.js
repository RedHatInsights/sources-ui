import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Grid } from '@patternfly/react-core/dist/js/layouts/Grid/Grid';
import { GridItem } from '@patternfly/react-core/dist/js/layouts/Grid/GridItem';
import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';

const Header = ({ name }) =>{
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
            {name && <GridItem xs={12}>
                { intl.formatMessage({
                    id: 'sources.editSourceDescription',
                    defaultMessage: 'Use the form fields below to make desired changes to source {name}.'
                }, { name: <b key="b">{name}</b> }) }
            </GridItem>}
        </Grid>
    );
};

Header.propTypes = {
    name: PropTypes.node
};

export default Header;
