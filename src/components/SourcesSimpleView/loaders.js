import React from 'react';
import PropTypes from 'prop-types';
import { RowWrapper } from '@patternfly/react-table';
import { RowLoader } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';

export const PlaceHolderTable = () => (
    <table className="sources-placeholder-table pf-m-compact ins-entity-table">
        <tbody>
            {new Array(12).fill(null).map((_, idx) => <tr key={idx}><td><RowLoader /></td></tr>)}
        </tbody>
    </table>
);

export const RowWrapperLoader = ({ row: { isDeleting, ...row }, ...initialProps }) => (isDeleting ?
    <tr><td colSpan="5"><RowLoader /></td></tr> :
    <RowWrapper {...initialProps} row={row} className='ins-c-sources__row-vertical-centered'/>
);

RowWrapperLoader.propTypes = {
    row: PropTypes.object.isRequired
};
