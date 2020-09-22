import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@patternfly/react-core/dist/js/layouts/Grid/Grid';
import { GridItem } from '@patternfly/react-core/dist/js/layouts/Grid/GridItem';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import TrashIcon from '@patternfly/react-icons/dist/js/icons/trash-icon';

import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';

import AuthenticationId from './AuthenticationId';

const GridLayout = ({ id, fields }) => {
    const { renderForm } = useFormApi();

    return (<Grid>
        <GridItem md={2} className="ins-c-sources__grid-layout">
            <Button variant="plain" aria-label="Action">
                <TrashIcon />
            </Button>
            <AuthenticationId id={id} />
        </GridItem>
        <GridItem md={10}>
            { renderForm(fields) }
        </GridItem>
    </Grid>);
};

GridLayout.propTypes = {
    id: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired
};

export default GridLayout;
