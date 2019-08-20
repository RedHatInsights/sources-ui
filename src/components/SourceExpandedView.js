import PropTypes from 'prop-types';
import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import { FormattedMessage } from 'react-intl';

const SourceExpandedView = () => (
    <Grid>
        <GridItem sm={6} md={4} lg={4} xl={4}>
            <dl>
                <dt>
                    <FormattedMessage
                        id="sources.expandedViewTitle"
                        defaultMessage="Access Key ID (User ID)"
                    />
                </dt>
                <dd>
                    <FormattedMessage
                        id="sources.expandedViewAdded"
                        defaultMessage="TO BE ADDED"
                    />
                </dd>
            </dl>
        </GridItem>
    </Grid>
);

SourceExpandedView.propTypes = {
    source: PropTypes.shape({
        id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        name: PropTypes.string.isRequired
    }).isRequired
};

export default SourceExpandedView;
