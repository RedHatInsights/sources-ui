import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Flex, FlexItem } from '@patternfly/react-core/dist/js/layouts/Flex';
import { Grid } from '@patternfly/react-core/dist/js/layouts/Grid/Grid';
import { GridItem } from '@patternfly/react-core/dist/js/layouts/Grid/GridItem';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import TrashIcon from '@patternfly/react-icons/dist/js/icons/trash-icon';

import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';

import AuthenticationId from './AuthenticationId';
import sourceEditContext from '../sourceEditContext';
import RemoveAuthPlaceholder from './RemoveAuthPlaceholder';

const GridLayout = ({ id, fields }) => {
    const intl = useIntl();
    const { renderForm } = useFormApi();
    const { setState, source } = useContext(sourceEditContext);

    const setAuthRemoving = () => setState({
        type: 'setAuthRemoving',
        removingAuth: id,
    });

    const isDeleting = source?.authentications?.find(auth => auth.id === id)?.isDeleting;

    if (isDeleting) {
        return <RemoveAuthPlaceholder />;
    }

    return (<Grid>
        <GridItem md={2}>
            <Flex>
                <FlexItem className="pf-u-mr-0">
                    <Button
                        variant="plain"
                        aria-label={intl.formatMessage({
                            id: 'sources.removeAuthAriaLabel',
                            defaultMessage: 'Remove authentication with id {id}'
                        }, { id })}
                        onClick={setAuthRemoving}>
                        <TrashIcon />
                    </Button>
                </FlexItem>
                <Flex>
                    <AuthenticationId id={id} />
                </Flex>
            </Flex>
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
