import React from 'react';
import PropTypes from 'prop-types';
import { RowWrapper } from '@patternfly/react-table';
import { RowLoader } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';
import { COLUMN_COUNT } from '../../views/sourcesViewDefinition';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner';
import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye';

export const PlaceHolderTable = () => (
    <Bullseye className="ins-c-sources__sources-placeholder-loader">
        <Spinner size="xl"/>
    </Bullseye>
);

export const RowWrapperLoader = ({ row: { isDeleting, ...row }, ...initialProps }) => (isDeleting ?
    <tr><td colSpan={COLUMN_COUNT}><RowLoader /></td></tr> :
    <RowWrapper {...initialProps} row={row} className='ins-c-sources__row-vertical-centered'/>
);

RowWrapperLoader.propTypes = {
    row: PropTypes.object.isRequired
};
